import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
}

const ReviewForm = ({ onSubmit, initialRating = 0, initialComment = "", isEditing = false }: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar sua avaliação" : "Avaliar este curso"}</CardTitle>
        <CardDescription>
          {isEditing ? "Atualize sua avaliação abaixo" : "Compartilhe sua experiência com este curso"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Sua nota</label>
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Comentário (opcional)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte o que você achou do curso..."
            rows={4}
          />
        </div>

        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
          {isEditing ? "Atualizar avaliação" : "Enviar avaliação"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
