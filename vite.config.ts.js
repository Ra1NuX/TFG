// vite.config.ts
import { defineConfig as defineConfig2 } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";

// vite-plugin-config.ts
import { defineConfig } from "vite-plugin-electron";
var vite_plugin_config_default = defineConfig({
  main: {
    entry: "electron/electron.ts"
  }
});

// vite.config.ts
var vite_config_default = defineConfig2({
  base: process.env.ELECTRON=="true" ? './' : ".",
  plugins: [
    react(),
    electron(vite_plugin_config_default)
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24nXHJcbmltcG9ydCBDb25maWcgZnJvbSAnLi92aXRlLXBsdWdpbi1jb25maWcnIFxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgZWxlY3Ryb24oQ29uZmlnKSxcclxuICBdXHJcbn0pXHJcbiIsICJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgbWFpbjoge1xyXG4gICAgZW50cnk6ICdlbGVjdHJvbi9lbGVjdHJvbi50cycsXHJcbiAgfSxcclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQ0E7QUFDQTtBQUNBOzs7QUNIQTtBQUVBLElBQU8sNkJBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxJQUNKLE9BQU87QUFBQTtBQUFBOzs7QURHWCxJQUFPLHNCQUFRLGNBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUDtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
