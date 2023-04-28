import { defineComponent } from 'vue';
import useAuthenticator from '../../composables/useAuthenticator';

const Authenticator = defineComponent({
  setup() {
    const facade = useAuthenticator();
    return { facade };
  },
  mounted() {
    const { initializeMachine } = this.facade;
    console.log('[Authenticator] initializing machine...');
    initializeMachine({});
  },
  render() {
    return <div>{this.facade.route}</div>;
  },
});

export default Authenticator;
