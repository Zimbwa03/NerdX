import { useState, useRef } from 'react';
import { Send, Image, X, Lightbulb, FileText, Video, BookOpen, Loader } from 'lucide-react';
import { MARKETPLACE_SUBJECTS } from '../../data/marketplaceConstants';
import { uploadTeacherFile } from '../../services/api/teacherMarketplaceApi';
import type { PostType, TeacherPost } from '../../types';

interface CreatePostFormProps {
  teacherId: string;
  teacherName: string;
  teacherImage?: string;
  onPostCreated: (post: TeacherPost) => void;
  onSubmitPost: (
    teacherId: string,
    content: string,
    postType: PostType,
    mediaUrl?: string | null,
    subjectTag?: string | null,
  ) => Promise<TeacherPost | null>;
}

const POST_TYPES: { type: PostType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Post', icon: <FileText size={14} /> },
  { type: 'tip', label: 'Tip', icon: <Lightbulb size={14} /> },
  { type: 'image', label: 'Photo', icon: <Image size={14} /> },
  { type: 'video', label: 'Video', icon: <Video size={14} /> },
  { type: 'resource', label: 'Resource', icon: <BookOpen size={14} /> },
];

export function CreatePostForm({
  teacherId,
  teacherName,
  teacherImage,
  onPostCreated,
  onSubmitPost,
}: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('text');
  const [subjectTag, setSubjectTag] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = teacherName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB');
      return;
    }

    setMediaFile(file);
    setError('');

    // Preview
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Auto-set post type based on file type
    if (file.type.startsWith('image/')) setPostType('image');
    else if (file.type.startsWith('video/')) setPostType('video');
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      // Upload media if present
      let mediaUrl: string | null = null;
      if (mediaFile) {
        mediaUrl = await uploadTeacherFile('teacher-profiles', mediaFile, teacherId);
        if (!mediaUrl) {
          setError('Failed to upload media. Try again.');
          setSubmitting(false);
          return;
        }
      }

      const post = await onSubmitPost(
        teacherId,
        content.trim(),
        postType,
        mediaUrl,
        subjectTag || null,
      );

      if (post) {
        onPostCreated({
          ...post,
          teacher_name: teacherName,
          teacher_image: teacherImage,
        });
        // Reset form
        setContent('');
        setPostType('text');
        setSubjectTag('');
        clearMedia();
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post__header">
        <div className="create-post__avatar">
          {teacherImage ? (
            <img src={teacherImage} alt={teacherName} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="create-post__label">Share something with your students</span>
      </div>

      <textarea
        className="create-post__textarea"
        placeholder="What's on your mind? Share a learning tip, resource, or update..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={2000}
        disabled={submitting}
      />

      {/* Media preview */}
      {mediaPreview && (
        <div className="create-post__media-preview">
          {mediaFile?.type.startsWith('video/') ? (
            <video src={mediaPreview} controls />
          ) : (
            <img src={mediaPreview} alt="Upload preview" />
          )}
          <button className="create-post__media-remove" onClick={clearMedia}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Post type pills */}
      <div className="create-post__options">
        <div className="post-type-selector">
          {POST_TYPES.map((pt) => (
            <button
              key={pt.type}
              className={`post-type-selector__pill${postType === pt.type ? ' post-type-selector__pill--active' : ''}`}
              onClick={() => setPostType(pt.type)}
              type="button"
            >
              {pt.icon}
              {pt.label}
            </button>
          ))}
        </div>

        <div className="create-post__row">
          <select
            className="create-post__subject-select"
            value={subjectTag}
            onChange={(e) => setSubjectTag(e.target.value)}
            disabled={submitting}
          >
            <option value="">Subject (optional)</option>
            {MARKETPLACE_SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            className="create-post__attach"
            onClick={() => fileInputRef.current?.click()}
            type="button"
            disabled={submitting}
            title="Attach image or video"
          >
            <Image size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {error && <div className="create-post__error">{error}</div>}

      <button
        className="create-post__submit"
        onClick={handleSubmit}
        disabled={!content.trim() || submitting}
      >
        {submitting ? (
          <>
            <Loader size={16} className="spin" />
            Posting...
          </>
        ) : (
          <>
            <Send size={16} />
            Post
          </>
        )}
      </button>
    </div>
  );
}
