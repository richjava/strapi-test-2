async function setPublicPermissions(strapi, newPermissions) {
    // Find the ID of the public role
    const publicRole = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" });
  
    // List all available permissions
    const publicPermissions = await strapi
      .query("permission", "users-permissions")
      .find({ type: "application", role: publicRole.id });
  
    // Update permission to match new config
    const controllersToUpdate = Object.keys(newPermissions);
    const updatePromises = publicPermissions
      .filter((permission) => {
        // Only update permissions included in newConfig
        if (!controllersToUpdate.includes(permission.controller)) {
          return false;
        }
        if (!newPermissions[permission.controller].includes(permission.action)) {
          return false;
        }
        return true;
      })
      .map((permission) => {
        // Enable the selected permissions
        return strapi
          .query("permission", "users-permissions")
          .update({ id: permission.id }, { enabled: true })
      });
    await Promise.all(updatePromises);
  }

  module.exports = setPublicPermissions;