import { memo } from 'react';
import { Copy, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { MathRenderer } from '../../../components/MathRenderer';
import { API_BASE_URL } from '../../../services/api/config';
import type { TeacherChatMessage } from '../teacherChatTypes';
import { TEACHER_CHAT_MAX_IMAGES } from '../teacherChatUtils';

interface RowProps {
  message: TeacherChatMessage;
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
  onOpenGraph: (url: string) => void;
}

const UserRow = memo(function UserRow({ message }: Pick<RowProps, 'message'>) {
  return (
    <div className="teacher-msg-row teacher-msg-row-user">
      <div className="teacher-msg-bubble teacher-msg-bubble-user">
        {message.image_urls?.length ? (
          <div className="teacher-msg-images">
            {message.image_urls.slice(0, TEACHER_CHAT_MAX_IMAGES).map((url, index) => (
              <img key={`${message.id}-img-${index}`} src={url} alt="Attachment" className="teacher-msg-thumb" />
            ))}
          </div>
        ) : null}
        <span>{message.content}</span>
      </div>
    </div>
  );
});

const AssistantRow = memo(function AssistantRow({ message, onCopy, onShare, onOpenGraph }: RowProps) {
  return (
    <div className="teacher-msg-row teacher-msg-row-assistant">
      <div className="teacher-msg-bubble teacher-msg-bubble-assistant">
        <div className="teacher-msg-assistant-content">
          <MathRenderer content={message.content} fontSize={16} />

          {message.graph_url ? (
            <div className="teacher-graph-wrap">
              <button
                type="button"
                className="teacher-graph-clickable"
                onClick={() => onOpenGraph(`${API_BASE_URL}${message.graph_url}`)}
              >
                <img src={`${API_BASE_URL}${message.graph_url}`} alt="Generated graph" />
              </button>
              <span className="teacher-graph-caption">Generated graph</span>
            </div>
          ) : null}

          {message.video_url ? (
            <div className="teacher-video-wrap">
              <video src={`${API_BASE_URL}${message.video_url}`} controls className="teacher-video-el" />
            </div>
          ) : null}
        </div>

        <div className="teacher-msg-actions">
          <button type="button" onClick={() => onCopy(message.content)} title="Copy response" aria-label="Copy response">
            <Copy size={14} aria-hidden />
          </button>
          <button type="button" title="Helpful" aria-label="Mark response as helpful">
            <ThumbsUp size={14} aria-hidden />
          </button>
          <button type="button" title="Needs improvement" aria-label="Mark response as not helpful">
            <ThumbsDown size={14} aria-hidden />
          </button>
          <button type="button" onClick={() => onShare(message.content)} title="Share response" aria-label="Share response">
            <Share2 size={14} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
});

interface TeacherChatMessageRowsProps {
  messages: TeacherChatMessage[];
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
  onOpenGraph: (url: string) => void;
}

export const TeacherChatMessageRows = memo(function TeacherChatMessageRows({
  messages,
  onCopy,
  onShare,
  onOpenGraph,
}: TeacherChatMessageRowsProps) {
  return (
    <>
      {messages.map((message) =>
        message.role === 'user' ? (
          <UserRow key={message.id} message={message} />
        ) : (
          <AssistantRow key={message.id} message={message} onCopy={onCopy} onShare={onShare} onOpenGraph={onOpenGraph} />
        ),
      )}
    </>
  );
});

export const TeacherChatTypingRow = memo(function TeacherChatTypingRow() {
  return (
    <div className="teacher-msg-row teacher-msg-row-assistant">
      <div className="teacher-msg-bubble teacher-msg-bubble-assistant teacher-typing-wrap">
        <span className="teacher-typing-dot" />
        <span className="teacher-typing-dot" />
        <span className="teacher-typing-dot" />
      </div>
    </div>
  );
});
