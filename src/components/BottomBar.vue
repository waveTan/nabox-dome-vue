<template>
  <div class="bottom">
    bottom
  </div>

</template>

<script>

  export default {
    name: "bottom-bar",
    data() {
      return {

      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .bottom {
    height: 60px;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #FFFFFF;
    border-top: 1px solid #EBEEF5;
    z-index: 9999;
    @media screen and (max-width: 1000px) {
      height: 50px;
    }
    //border-bottom-color: linear-gradient(to right, #4ef16a, #0ede94);
    .w1200 {
      height: 100%;
      line-height: 60px;
      .fl {
        .p1, .p2 {
          font-size: 12px;
          line-height: 20px;
        }
        .p1 {
          margin-top: 8px;
        }
      }
      ul {
        margin-top: 8px;
        li {
          padding: 0 5px;
          font-size: 14px;
          &:first-child {
            padding: 0;
          }
          &:last-child {
            font-size: 14px;
            padding: 0 0 0 5px;
          }
          svg {
            cursor: pointer;
            width: 25px;
            fill: #4ff16a;
          }
        }
      }
    }
  }

  .bottom {
    height: 4.9rem;
    box-sizing: content-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    padding-bottom: var(safe-area-inset-bottom);
    .nav {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 4.9rem;
      i, span {
        display: block;
        line-height: 1rem;
      }
      i {
        margin: 1.2rem 0 0.2rem;
      }
    }
  }
</style>
