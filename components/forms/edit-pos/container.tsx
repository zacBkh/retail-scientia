import { Button } from "@/components/shad/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shad/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import EditUserOfPOS from "./edit-user-of-pos";

enum EditPosStep {
  INDEX,
  ADD_USER,
  REMOVE_USER,
  REMOVE_POS,
  CONFIRM,
}

export const EditPosDialogContainer = () => {
  const [step, setStep] = useState<EditPosStep>(EditPosStep.INDEX);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const view_mapper = {
    [EditPosStep.INDEX]: {
      title: "Edit this POS",
      description:
        "You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.",
      children: (
        <>
          <Button>Add a user to this POS</Button>
          <Button>Remove a user from this POS</Button>
          <Button>Delete POS</Button>
        </>
      ),
    },
    [EditPosStep.ADD_USER]: {
      title: "Edit this POS",
      description:
        "You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.",
      children: (
        <>
          <Button>Add a user to this POS</Button>
          <Button>Remove a user from this POS</Button>
          <Button>Delete POS</Button>
        </>
      ),
    },
    [EditPosStep.REMOVE_POS]: {
      title: "Edit this POS",
      description:
        "You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.",
      children: (
        <>
          <Button onClick={() => setStep(EditPosStep.CONFIRM)}>
            Add a user to this POS
          </Button>
          <p>Hello zukablet</p>
        </>
      ),
    },
    [EditPosStep.REMOVE_USER]: {
      title: "Edit this POS",
      description:
        "You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.",
      children: (
        <>
          <Button>Add a user to this POS</Button>
          <Button>Remove a user from this POS</Button>
          <Button>Delete POS</Button>
        </>
      ),
    },
    [EditPosStep.CONFIRM]: {
      title: "Edit this POS",
      description:
        "You can edit the name, country, add and remove staff or delete dadadzd from your point of sales.",
      children: (
        <>
          <Button>Add a user to this POS</Button>
          <Button>Remove a user from this POS</Button>
          <Button>Delete POS</Button>
        </>
      ),
    },
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        className="cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
        asChild
      >
        <Pencil className="ml-4" size={18} strokeWidth={1} />
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{view_mapper[step].title}</DialogTitle>
          <DialogDescription className="mt-8">
            {view_mapper[step].description}
          </DialogDescription>
        </DialogHeader>
        {view_mapper[step].children}
      </DialogContent>
    </Dialog>
  );
};
