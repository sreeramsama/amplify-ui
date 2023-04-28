<script setup>
import { toRefs } from 'vue';
import useAuthenticator from '../../composables/useAuthenticator';

const facade = useAuthenticator();
</script>
<template>
  <h1>AuthenticatorX</h1>
  Current Route: {{ facade.route }}
</template>
