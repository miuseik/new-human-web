<template>
  <div class="docs-container">
    <!-- 刚体类型创建示例 -->
    <CodeBlock title="刚体类型快速创建">
      <pre>{{ codeSnippets.quickCreate }}</pre>
    </CodeBlock>

    <!-- 动态刚体配置示例 -->
    <CodeBlock title="动态刚体详细配置">
      <pre>{{ codeSnippets.configExample }}</pre>
    </CodeBlock>

    <!-- 关键参数说明 -->
    <div class="parameter-table">
      <h3>核心配置参数说明</h3>
      <table>
        <tr>
          <th>方法</th>
          <th>作用</th>
          <th>默认值</th>
          <th>单位</th>
        </tr>
        <tr>
          <td>setTranslation</td>
          <td>设置初始位置</td>
          <td>(0,0,0)</td>
          <td>米</td>
        </tr>
        <tr>
          <td>setRotation</td>
          <td>设置初始旋转（四元数）</td>
          <td>无旋转</td>
          <td>弧度</td>
        </tr>
        <tr>
          <td>setLinvel</td>
          <td>设置线速度</td>
          <td>(0,0,0)</td>
          <td>m/s</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { world, rigidBodyDesc, rigidBodyHandle } from './index.ts';

const codeSnippets = ref({
  quickCreate: `
// 四种刚体类型快速创建
const fixed = RAPIER.RigidBodyDesc.fixed();
const dynamic = RAPIER.RigidBodyDesc.dynamic();
const velocityBased = RAPIER.RigidBodyDesc.kinematicVelocityBased();
const positionBased = RAPIER.RigidBodyDesc.kinematicPositionBased();
  `.trim(),

  configExample: `
// 动态刚体完整配置示例
const desc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
  .setTranslation(0, 5, 1)
  .setRotation({ w: 1, x: 0, y: 0, z: 0 })
  .setLinvel(1, 3, 4)
  .setGravityScale(0.5)
  .setCcdEnabled(true);
  `.trim()
});

// 可选：添加交互功能（如实时更新位置）
const updatePosition = () => {
  if (rigidBody) {
    const pos = rigidBody.translation();
    console.log('Current Position:', pos);
  }
};
</script>

<style scoped lang="scss">
.docs-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;

  .CodeBlock {
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
    background: #2d2d2d;
    color: #ffffff;
    font-family: 'Consolas', monospace;
  }

  .parameter-table {
    margin-top: 2rem;
    table {
      width: 100%;
      border-collapse: collapse;
      th, td {
        padding: 0.75rem;
        border: 1px solid #ddd;
      }
      th {
        background: #f8f9fa;
      }
    }
  }
}
</style>
