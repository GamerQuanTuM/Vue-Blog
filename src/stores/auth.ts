import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAdminLoggedIn: false
  }),
  actions: {
    checkLoginStatus() {
      this.isAdminLoggedIn = JSON.parse(localStorage.getItem("admin") as string) || false;
    },
    setLoginStatus(status: boolean) {
      this.isAdminLoggedIn = status;
      localStorage.setItem("admin", JSON.stringify(status));
    }
  }
});