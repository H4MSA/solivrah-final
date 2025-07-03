import React, { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { Quest } from "@/types";
import { QuestCompletePhotoUpload } from "@/components/QuestCompletePhotoUpload";

interface QuestCompleteModalProps {
  quest: Quest;
  onComplete: (photoUrl: string) => void;
  onCancel: () => void;
  isVisible: boolean;
  showPhotoUpload?: boolean;
}

export const QuestCompleteModal: React.FC<QuestCompleteModalProps> = ({
  quest,
  onComplete,
  onCancel,
  isVisible,
  showPhotoUpload = false
}) => {
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(showPhotoUpload);

  const handlePhotoUploadSuccess = (photoUrl?: string) => {
    onComplete(photoUrl || '');
  };

  return (
    <>
      {showPhotoUploadModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <QuestCompletePhotoUpload
            questId={quest.id}
            onSuccess={handlePhotoUploadSuccess}
            onCancel={onCancel}
          />
        </div>
      ) : null}
    </>
  );
};
