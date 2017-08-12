<template>
  <div>
    <h1>vuex 测试</h1>
    Clicked: {{ gethospital }} times
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'

  export default {
    computed: {
    ...mapGetters([
      'gethospital'
    ])
    },
    methods: {
    ...mapActions([
      'hospital',
    ])

    }
  }

</script>