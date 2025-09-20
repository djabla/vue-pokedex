<template>
    <div class="flex flex-col gap-4 p-4">
        <h2>User Authentication</h2>
        <input class="input" v-model="username" placeholder="Username" />
        <input class="input password" v-model="password" type="password" placeholder="Password" />

        <button class="btn" @click="signup">Sign Up</button>
        <button class="btn" @click="login">Log In</button>

        <div role="alert" class="alert alert-error" v-if="error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
        </div>

        <div role="alert" class="alert alert-success" v-if="success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ success }}</span>
        </div>
    </div>
</template>

<script>
import PokeApi from "../../data/pokeApi";

export default {
    name: "user_signin",
    data() {
        return {
            username: "",
            password: "",
            success: "",
            error: "",
        };
    },
    methods: {
        async signup() {
            if (!this.checkPasswordRequirements()) {
                return;
            }
            try {
                await PokeApi.signup(this.username, this.password);
                this.success = "Signup successful. You can log in now.";
                this.clearPassword();
            } catch (err) {
                this.error = err.response?.data?.error || err.message || "Signup failed";
                this.clearPassword();
            }
        },
        async login() {
            try {
                await PokeApi.login(this.username, this.password);
                this.message = "Login successful!";
                this.$emit("logged-in");
                this.reloadApp();
                this.setSessionUsername(this.username);
            } catch (err) {
                this.message = err.response?.data?.error || "Login failed";
            }
        },
        reloadApp() {
            window.location.reload();
        },
        clearForm() {
            this.username = "";
            this.password = "";
        },
        clearMessages() {
            this.success = "";
            this.error = "";
        },
        clearPassword() {
            this.password = "";
        },
        checkPasswordRequirements() {
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(this.password);
            const hasLowerCase = /[a-z]/.test(this.password);
            const hasNumber = /\d/.test(this.password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

            if (this.password.length < minLength) {
                this.error = `Password must be at least ${minLength} characters long.`;
                return false;
            }
            if (!hasUpperCase) {
                this.error = "Password must contain at least one uppercase letter.";
                return false;
            }
            if (!hasLowerCase) {
                this.error = "Password must contain at least one lowercase letter.";
                return false;
            }
            if (!hasNumber) {
                this.error = "Password must contain at least one number.";
                return false;
            }
            if (!hasSpecialChar) {
                this.error = "Password must contain at least one special character.";
                return false;
            }
            this.error = "";
            return true;
        },
        setSessionUsername(username) {
            localStorage.setItem("username", username);
        },
    },
};
</script>