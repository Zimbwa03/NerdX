"""
Web Search Tool for Project Assistant
Performs web searches to gather research and literature for student projects
"""

import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class WebSearchTool:
    """Handles web search functionality for project research"""
    
    def search(self, query: str) -> str:
        """
        Perform a web search and return formatted results
        
        Args:
            query: Search query string
            
        Returns:
            Formatted search results as a string
        """
        try:
            # Provide structured research guidance (Beta feature - free)
            # Future: Integrate with Google Custom Search API, SerpAPI, or similar service
            
            result = f"**Research Guidance for:** {query}\n\n"
            result += "**📚 Recommended Research Sources:**\n\n"
            result += f"1. **Academic Research**\n"
            result += f"   • Google Scholar: scholar.google.com\n"
            result += f"   • Search for: \"{query}\" + case study\n"
            result += f"   • Look for peer-reviewed papers and studies\n\n"
            
            result += f"2. **Government & NGO Resources**\n"
            result += f"   • Zimbabwe government websites\n"
            result += f"   • UNICEF Zimbabwe, WHO, UNESCO reports\n"
            result += f"   • Search for: \"{query}\" + Zimbabwe + policy\n\n"
            
            result += f"3. **Community Initiatives**\n"
            result += f"   • Local NGO websites and reports\n"
            result += f"   • News articles about similar projects\n"
            result += f"   • Search for: \"{query}\" + community solution\n\n"
            
            result += f"4. **Existing Solutions**\n"
            result += f"   • Look for schools/organizations with similar projects\n"
            result += f"   • YouTube educational channels\n"
            result += f"   • Search for: \"{query}\" + implementation\n\n"
            
            result += "**📝 What to Look For:**\n"
            result += "• How others have solved similar problems\n"
            result += "• What worked well (strengths)\n"
            result += "• What didn't work (weaknesses)\n"
            result += "• Data and statistics supporting solutions\n\n"
            
            result += "💡 **Tip:** Take notes and cite your sources for your Literature Review!"
            
            return result
            
        except Exception as e:
            logger.error(f"Error in web search: {e}", exc_info=True)
            return "Error performing web search. Please try again."
