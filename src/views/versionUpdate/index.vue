<template>
  <el-container class="content">
    <article class="markdown-body"><readme /></article>
  </el-container>
</template>

<script>
import readme from '../../assets/versionUpdate/versionUpdate.md'
export default {
  components: { readme },
  data() {
    return {
      htmlMD: null
    }
  },
  mounted() {
    this.getMD()
  },
  methods: {
    getMD() {
    }
  }
}
</script>

<style scoped>
/* markdown 高亮 */
.hljs-name{
    color: #22863a;
}
.hljs-attr{
    color: #6f42c1;
}
.hljs-keyword{
    color: red;
}
.hljs-string{
    color: #032f62;
}
.markdown-body{
  position: absolute;
  width:80%;
  top:0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}
/* Tomorrow Night Bright Theme */
    /* Original theme - https://github.com/chriskempson/tomorrow-theme */
    /* http://jmblog.github.com/color-themes-for-google-code-highlightjs */

    /* Tomorrow Comment */
    .hljs-comment,
    .hljs-quote {
        color: #969896;
    }

    /* Tomorrow Red */
    .hljs-variable,
    .hljs-template-variable,
    .hljs-tag,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class,
    .hljs-regexp,
    .hljs-deletion {
        color: #15b8cf;
    }

    /* Tomorrow Orange */
    .hljs-number,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params,
    .hljs-meta,
    .hljs-link {
        color: #e78c45;

    }

    /* Tomorrow Yellow */
    .hljs-attribute {
        color: #e7c547;
    }

    /* Tomorrow Green */
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-addition {
        color: #7aa6da;
    }

    /* Tomorrow Blue */
    .hljs-title,
    .hljs-section {
        color: #7aa6da;
    }

    /* Tomorrow Purple */
    .hljs-keyword,
    .hljs-selector-tag {
        color: #f92672;
    }

    .hljs {
        display: block;
        overflow-x: auto;
        background: black;
        color: #eaeaea;
        padding: 2.5em;
        line-height: 1.5;
    }

    .hljs-emphasis {
        font-style: italic;
    }

    .hljs-strong {
        font-weight: bold;
    }

    thead {
        background: #a8a8a8;
    }

    td:nth-child(odd) {
        border-right: 1px solid #ccc;
    }

    table {
        width: 100%;
        text-align: center;
        border: 1px solid #ccc;
    }

    blockquote {
        background: #eaeaea;
        color: #546E7A;
        padding: 1px 17px;
        margin: 0;
        margin-bottom: 20px;
        border-left: 7px solid #03A9F4;
    }

    code {
        max-height: 300px !important;
        color: #e83e8c;
        display: block;
    }
</style>
