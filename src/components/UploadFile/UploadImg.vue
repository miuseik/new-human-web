<template>
    <el-upload class="inline" ref="uploadImgRef" :http-request="uploadImg" :auto-upload="false" :accept="'.jpg,.png'">
        　　<template #trigger>
        　　　　<el-button type="primary" plain>
        选择图片
        　　　　</el-button>
        　　</template>
    </el-upload>
    <el-button type="primary" @click="enableClick(formRef)">启用</el-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([
    {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
watch(() => fileList, val => {
    console.log('====',val.value)
}, {
    deep     : true,
    immediate: true
})
</script>
