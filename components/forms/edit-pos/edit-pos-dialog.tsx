"use client";

import { useRouter } from "next/navigation";

import { FC, useState, useEffect } from "react";

import type { User } from "@prisma/client";

import { PROMISE_TOAST_WAIT } from "@/constants";

interface ButtonCltProps {
  POSId: number;
  POSName: string;

  usersOfThisPOS?: User[];
}
import { toast } from "react-toastify";
import { deletePOS, editUserPOSRelation } from "@/services/fetchers-api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shad/ui/dialog";

import { Pencil, UserX, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/shad/ui/button";

import EditUserOfPOS from "./edit-user-of-pos";

import { ConnectOrDisconnect, SWR_KEYS } from "@/constants";
const { CONNECT, DISCONNECT } = ConnectOrDisconnect;

import { mutate } from "swr";
import { UserWithoutPwd } from "@/types";

import { getAsyncToast } from "@/utils/get-async-toaster";
import ConfirmationDialog from "../confirmation-dialog";

const EditPOSDialog: FC<ButtonCltProps> = ({
  POSId,
  POSName,
  usersOfThisPOS,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isRemoveUserFromPOSActive, setIsRemoveUserFromPOSActive] =
    useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [isAddUserToPOSActive, setIsAddUserToPOSActive] = useState(false);

  // Reset modal state when close it
  useEffect(() => {
    if (!isDialogOpen) {
      setIsRemoveUserFromPOSActive(false);
      setIsAddUserToPOSActive(false);
    }
  }, [isDialogOpen]);

  const router = useRouter();

  const handleDeletePOS = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setIsDialogOpen(false);
    await getAsyncToast(() => deletePOS(POSId));
    router.refresh();
  };

  const displayElementsStateWise = () => {
    const content = {
      header: "Edit ",
      subHeader: `You can edit the name, country, add and remove staff or delete ${POSName} from your point of sales.`,
      buttonAction: "Remove a user from this POS",

      shouldDeletePOSShow:
        isRemoveUserFromPOSActive || isAddUserToPOSActive ? false : true,
    };

    // If remove user to POS active
    if (isRemoveUserFromPOSActive) {
      content.header = "Remove users from ";
      content.subHeader =
        "You are about to disconnect a user from his/her point of sale. This will not delete the user. The user will not be affected to a POS anymore.";
      content.buttonAction = "Cancel";
      return content;
    }

    // If add user to POS active
    if (isAddUserToPOSActive) {
      content.header = "Add users to ";
      content.subHeader =
        "You are about to add a user to a point of sale. This will replace the current POS of the user.";
      content.buttonAction = "Cancel";
      return content;
    }

    if (!isRemoveUserFromPOSActive && showConfirmDelete) {
      content.header = "Are you sure you want to delete this POS?";
      content.subHeader =
        "Once deleted, your POS cannot be restored. All its data (including users and history) will be removed.";
      content.buttonAction = "Yes, remove POS";
    }

    return content;
  };

  // TO DO close modal, display toaster
  const handleConnectUserToPOS = async (
    mode: ConnectOrDisconnect,
    user: UserWithoutPwd
  ) => {
    await getAsyncToast(() => editUserPOSRelation(POSId, user.id, CONNECT));

    router.refresh();
    mutate(SWR_KEYS.GET_USERS);
  };
  const handleRemoveUserFromPOS = async (
    mode: ConnectOrDisconnect,
    user: UserWithoutPwd
  ) => {
    console.log("You want to remove user", user);
    await getAsyncToast(() => editUserPOSRelation(POSId, user.id, DISCONNECT));
    router.refresh();
    mutate(SWR_KEYS.GET_USERS);
  };

  return (
    <>
      {showConfirmDelete ? (
        <ConfirmationDialog
          title={displayElementsStateWise().header}
          description={displayElementsStateWise().subHeader}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      ) : (
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
              <DialogTitle>
                {displayElementsStateWise().header}
                <span className="font-black">{POSName}</span>
              </DialogTitle>
              <DialogDescription className="mt-8">
                {displayElementsStateWise().subHeader}
              </DialogDescription>
            </DialogHeader>

            {/* Add user to POS */}
            {!isRemoveUserFromPOSActive && (
              <Button
                className="w-fit"
                size={"sm"}
                onClick={() => setIsAddUserToPOSActive((prev) => !prev)}
              >
                {isAddUserToPOSActive ? "Cancel" : "Add a user to this POS"}
                <UserPlus strokeWidth={2} className="ml-4" />
              </Button>
            )}

            {isAddUserToPOSActive ? (
              <EditUserOfPOS
                mode={CONNECT}
                POSId={POSId}
                onClickActionTable={handleConnectUserToPOS}
              />
            ) : (
              ""
            )}

            {/* Disconnect user from POS */}
            {!isAddUserToPOSActive && (
              <Button
                className="w-fit"
                size={"sm"}
                onClick={() => setIsRemoveUserFromPOSActive((prev) => !prev)}
              >
                {isRemoveUserFromPOSActive
                  ? "Cancel"
                  : "Remove a user from this POS"}

                <UserX strokeWidth={2} className="ml-4" />
              </Button>
            )}

            {isRemoveUserFromPOSActive ? (
              <EditUserOfPOS
                mode={DISCONNECT}
                usersOfThisPOS={usersOfThisPOS}
                POSId={POSId}
                onClickActionTable={handleRemoveUserFromPOS}
              />
            ) : (
              ""
            )}

            {/* Btn Delete */}
            {displayElementsStateWise().shouldDeletePOSShow && (
              <Button
                disabled={!displayElementsStateWise().shouldDeletePOSShow}
                variant="destructive"
                className="w-fit"
                size={"sm"}
                onClick={handleDeletePOS}
              >
                Delete POS
                <Trash2 strokeWidth={2} className="ml-4" />
              </Button>
            )}

            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditPOSDialog;
