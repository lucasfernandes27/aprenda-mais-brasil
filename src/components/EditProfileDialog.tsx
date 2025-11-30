import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/contexts/AuthContext";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSave: (updates: Partial<User>) => void;
}

const EditProfileDialog = ({ open, onOpenChange, user, onSave }: EditProfileDialogProps) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");

  const handleSave = () => {
    onSave({
      name,
      bio,
      avatar,
    });
    onOpenChange(false);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Atualize suas informações pessoais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              {avatar ? (
                <img src={avatar} alt={name} className="object-cover" />
              ) : (
                <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="w-full space-y-2">
              <Label htmlFor="avatar">URL da foto de perfil</Label>
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Cole o link de uma imagem para usar como foto de perfil
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
