import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Prescription } from "@/types";
import { FileText } from "lucide-react";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prescription: Omit<Prescription, 'id' | 'created_at'>) => void;
  appointmentId: string;
  patientName: string;
}

export const PrescriptionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  appointmentId, 
  patientName 
}: PrescriptionModalProps) => {
  const [formData, setFormData] = useState({
    medicine: '',
    dosage: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicine.trim() || !formData.dosage.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        appointment_id: appointmentId,
        medicine: formData.medicine.trim(),
        dosage: formData.dosage.trim(),
        note: formData.note.trim() || undefined
      });
      
      // Reset form
      setFormData({ medicine: '', dosage: '', note: '' });
      onClose();
    } catch (error) {
      console.error('Error submitting prescription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ medicine: '', dosage: '', note: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-secondary to-secondary-variant p-2 rounded-lg">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Create Prescription
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                For patient: {patientName}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicine">Medicine *</Label>
            <Input
              id="medicine"
              value={formData.medicine}
              onChange={(e) => setFormData({ ...formData, medicine: e.target.value })}
              placeholder="e.g., Amoxicillin 500mg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 1 tablet twice daily"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Additional Notes</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Any special instructions or notes..."
              rows={3}
            />
          </div>
          
          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="medical-secondary"
              disabled={isSubmitting || !formData.medicine.trim() || !formData.dosage.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Prescription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};