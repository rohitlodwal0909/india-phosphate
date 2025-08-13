
export const getPermissions = (
  logindata: any,
  moduleId: number,
  submoduleId: number
) => {
  const perms = logindata?.permission?.filter(
    (p: any) =>
      p.module_id === moduleId &&
      p.submodule_id === submoduleId &&
      p.status
  ) || [];

  return {
    view: perms.some((p: any) => p.permission_id === 1),
    add: perms.some((p: any) => p.permission_id === 2),
    edit: perms.some((p: any) => p.permission_id === 3),
    del: perms.some((p: any) => p.permission_id === 4),
  };
};
