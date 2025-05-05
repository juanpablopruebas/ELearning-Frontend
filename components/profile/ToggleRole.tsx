"use client";

import { useEffect, useState } from "react";

import { useUpdateUserRoleMutation } from "@/redux/features/api/userApi";
import { toast } from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface ToggleRoleProps {
  user: User | null;
}

export const ToggleRole = ({ user }: ToggleRoleProps) => {
  const [userRole, setUserRole] = useState<"admin" | "user">(
    (user?.role as "admin" | "user") || "user"
  );

  const [updateUserRole, { isSuccess, error }] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("User role updated successfully!");
    }
    if (error) {
      const msg =
        "data" in error
          ? (error.data as { message?: string }).message
          : "error" in error
          ? error.error
          : "Something went wrong.";
      toast.error(msg);
    }
  }, [isSuccess, error]);

  const handleSave = () => {
    if (!user) return;
    if (userRole === user.role) {
      toast("No change detected.");
      return;
    }
    updateUserRole({ id: user._id, role: userRole });
  };

  return (
    <div className="flex flex-col items-start space-y-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow mt-2">
      <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
        Switch User Role
      </h2>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">User</span>
        <Switch
          checked={userRole === "admin"}
          onCheckedChange={(checked) => setUserRole(checked ? "admin" : "user")}
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Admin</span>
      </div>
      <Button onClick={handleSave} disabled={userRole === user?.role}>
        Save Role
      </Button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Demo toggle: switch to admin view for testing only.
      </p>
    </div>
  );
};
