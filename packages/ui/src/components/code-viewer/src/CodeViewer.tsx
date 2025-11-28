import { defineComponent, computed, watchEffect, ref } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';
import json from 'highlight.js/lib/languages/json';
import shell from 'highlight.js/lib/languages/shell';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github-dark.css';
import './styles/index.scss';

// 注册需要的语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('json', json);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('bash', shell);
hljs.registerLanguage('vue', xml); // Vue 使用 XML 语法高亮

export interface CodeViewerProps {
  /** 代码内容 */
  code: string;
  /** 语言类型 */
  language?:
    | 'typescript'
    | 'javascript'
    | 'markdown'
    | 'json'
    | 'shell'
    | 'ts'
    | 'js'
    | 'md'
    | 'bash'
    | 'vue';
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
}

const codeViewerProps = {
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String as PropType<CodeViewerProps['language']>,
    default: 'typescript',
  },
  showLineNumbers: {
    type: Boolean,
    default: true,
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
} as const;

export const CodeViewer = defineComponent({
  name: 'LeCodeViewer',
  props: codeViewerProps,
  setup(props) {
    const codeRef = ref<HTMLElement>();

    // 高亮代码
    const highlightedCode = computed(() => {
      try {
        const result = hljs.highlight(props.code, {
          language: props.language || 'typescript',
        });
        return result.value;
      } catch (error) {
        console.error('代码高亮失败:', error);
        return props.code;
      }
    });

    // 获取代码行
    const codeLines = computed(() => {
      return props.code.split('\n');
    });

    watchEffect(() => {
      if (codeRef.value) {
        codeRef.value.innerHTML = highlightedCode.value;
      }
    });

    return () => (
      <div class={['le-code-viewer', props.class]} style={props.style}>
        <div class="le-code-viewer__container">
          {/* 行号 */}
          {props.showLineNumbers && (
            <div class="le-code-viewer__line-numbers">
              {codeLines.value.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
          )}

          {/* 代码内容 */}
          <div class="le-code-viewer__content">
            <pre class="le-code-viewer__pre">
              <code ref={codeRef} class={`hljs language-${props.language}`} />
            </pre>
          </div>
        </div>
      </div>
    );
  },
});

export default CodeViewer;
