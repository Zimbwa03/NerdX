#!/usr/bin/env python3
"""
Vector Search Service - Free Alternative to Pinecone
Provides similarity search for past paper questions using ChromaDB
Zero API costs, 100% self-hosted, persistent storage
"""

import logging
import os
from typing import Dict, List, Optional
import uuid

logger = logging.getLogger(__name__)

# Global instances
_chroma_client = None
_collection = None

class VectorSearchService:
    """Free vector search service using ChromaDB"""
    
    def __init__(self, collection_name: str = "past_papers"):
        """Initialize Vector Search Service"""
        self.collection_name = collection_name
        self.persist_directory = os.path.join(os.getcwd(), "chroma_db")
        
        # Initialize ChromaDB
        self._init_chroma()
        logger.info(f"Vector Search Service initialized (ChromaDB in {self.persist_directory})")
    
    def _init_chroma(self):
        """Initialize ChromaDB client and collection"""
        global _chroma_client, _collection
        
        if _chroma_client is None:
            try:
                import chromadb
                from chromadb.utils import embedding_functions
                
                # Create persistent client
                _chroma_client = chromadb.PersistentClient(path=self.persist_directory)
                
                # Use default embedding function (all-MiniLM-L6-v2)
                # This matches our requirement for free, local embeddings
                emb_fn = embedding_functions.DefaultEmbeddingFunction()
                
                # Get or create collection
                _collection = _chroma_client.get_or_create_collection(
                    name=self.collection_name,
                    embedding_function=emb_fn
                )
                
                logger.info(f"✅ ChromaDB collection '{self.collection_name}' ready")
                
            except ImportError:
                logger.error("ChromaDB not installed. Run: pip install chromadb")
                raise ImportError("ChromaDB library not found. Install: pip install chromadb")
            except Exception as e:
                logger.error(f"Error initializing ChromaDB: {e}")
                raise
        
        self.client = _chroma_client
        self.collection = _collection
    
    def index_question(self, question_data: Dict) -> bool:
        """
        Index a single question
        """
        try:
            # Prepare metadata (flat dictionary)
            metadata = {
                'topic': question_data.get('topic', ''),
                'difficulty': question_data.get('difficulty', 'medium'),
                'year': int(question_data.get('year', 2023)),
                'paper': int(question_data.get('paper', 1)),
                'question_number': int(question_data.get('question_number', 1)),
                'source': question_data.get('source', 'ZIMSEC'),
                'latex_equation': question_data.get('latex_equation', ''),
                'solution': question_data.get('solution', '')[:1000]  # Truncate if too long
            }
            
            # Add to collection
            self.collection.add(
                documents=[question_data.get('question_text', '')],
                metadatas=[metadata],
                ids=[question_data.get('id', str(uuid.uuid4()))]
            )
            
            logger.info(f"✅ Indexed question: {question_data.get('id')}")
            return True
            
        except Exception as e:
            logger.error(f"Error indexing question: {e}")
            return False
    
    def batch_index(self, questions: List[Dict]) -> Dict:
        """Index multiple questions"""
        success_count = 0
        errors = []
        
        # Prepare batch data
        docs = []
        metadatas = []
        ids = []
        
        for q in questions:
            try:
                docs.append(q.get('question_text', ''))
                ids.append(q.get('id', str(uuid.uuid4())))
                metadatas.append({
                    'topic': q.get('topic', ''),
                    'difficulty': q.get('difficulty', 'medium'),
                    'year': int(q.get('year', 2023)),
                    'paper': int(q.get('paper', 1)),
                    'question_number': int(q.get('question_number', 1)),
                    'source': q.get('source', 'ZIMSEC'),
                    'latex_equation': q.get('latex_equation', ''),
                    'solution': q.get('solution', '')[:1000]
                })
                success_count += 1
            except Exception as e:
                errors.append({'id': q.get('id'), 'error': str(e)})
        
        if docs:
            try:
                self.collection.add(
                    documents=docs,
                    metadatas=metadatas,
                    ids=ids
                )
            except Exception as e:
                return {'total': len(questions), 'success': 0, 'failed': len(questions), 'error': str(e)}
        
        return {
            'total': len(questions),
            'success': success_count,
            'failed': len(errors),
            'errors': errors
        }
    
    def find_similar_questions(self, query_text: str, top_k: int = 5, 
                              filters: Optional[Dict] = None) -> List[Dict]:
        """Find similar questions"""
        try:
            # Prepare filters
            where_clause = {}
            if filters:
                # Chroma uses specific filter syntax
                # Simple equality filters
                for k, v in filters.items():
                    where_clause[k] = v
            
            # Query
            results = self.collection.query(
                query_texts=[query_text],
                n_results=top_k,
                where=where_clause if where_clause else None
            )
            
            # Format results
            similar_questions = []
            
            if results['ids']:
                ids = results['ids'][0]
                distances = results['distances'][0]
                metadatas = results['metadatas'][0]
                documents = results['documents'][0]
                
                for i in range(len(ids)):
                    meta = metadatas[i]
                    similar_questions.append({
                        'id': ids[i],
                        'question_text': documents[i],
                        'topic': meta.get('topic'),
                        'difficulty': meta.get('difficulty'),
                        'year': meta.get('year'),
                        'paper': meta.get('paper'),
                        'question_number': meta.get('question_number'),
                        'latex_equation': meta.get('latex_equation'),
                        'solution': meta.get('solution'),
                        'source': meta.get('source'),
                        'similarity_score': 1 - distances[i],  # Chroma returns distance
                        'distance': distances[i]
                    })
            
            return similar_questions
            
        except Exception as e:
            logger.error(f"Error searching: {e}")
            return []
    
    def get_collection_stats(self) -> Dict:
        """Get stats"""
        try:
            count = self.collection.count()
            return {
                'collection_name': self.collection_name,
                'total_questions': count,
                'backend': 'ChromaDB',
                'persist_directory': self.persist_directory,
                'cost': '$0/month'
            }
        except Exception as e:
            return {'error': str(e)}

    def verify_installation(self) -> Dict:
        """Verify installation"""
        try:
            import chromadb
            return {
                'installed': True,
                'version': chromadb.__version__,
                'backend': 'ChromaDB',
                'cost': '$0/month'
            }
        except ImportError:
            return {'installed': False}

# Global instance
vector_search_service = None

def get_vector_search_service(collection_name: str = "past_papers") -> VectorSearchService:
    global vector_search_service
    if vector_search_service is None:
        vector_search_service = VectorSearchService(collection_name)
    return vector_search_service
