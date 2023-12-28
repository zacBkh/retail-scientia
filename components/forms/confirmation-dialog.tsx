import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shad/ui/dialog";
import { Button } from "@/components/shad/ui/button";
import { Container } from "@radix-ui/themes";

type Props = {
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmationDialog({
  title,
  description,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <>
      <Dialog defaultOpen>
        <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>
              <p className="font-black">{title}</p>
            </DialogTitle>
            {description ? (
              <DialogDescription className="mt-8">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <Container>
            <Button
              variant="default"
              className="w-fit mr-2"
              size="sm"
              onClick={onCancel}
            >
              Go back
            </Button>
            <Button
              variant="destructive"
              className="w-fit"
              size="sm"
              onClick={onConfirm}
            >
              Yes, confirm
            </Button>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}
