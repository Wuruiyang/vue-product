<template>
  <div class="addGoods">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
      <!-- 基本信息 -->
      <el-tab-pane name="step0" label="基本信息">
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model.number="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model.number="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="form.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销"></el-form-item>
        </el-form>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <!-- 商品图片 -->
      <el-tab-pane name="step1" label="商品图片">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          list-type="picture-card"
          :on-success="getPic"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <!-- 商品内容 -->
      <el-tab-pane name="step2" label="商品内容">
        <quill-editor v-model="form.goods_introduce" ref="QuillEditor"></quill-editor>
        <el-button style="margin-top: 12px;" @click="complete">完成</el-button>
      </el-tab-pane>
      <!-- 放大图片 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'step0',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  async created () {
    const res = await this.axios.get('categories?type=3')
    // console.log(res)
    const { meta, data } = res
    if (meta.status === 200) {
      this.options = data
    }
  },
  methods: {
    next () {
      this.active++
      this.activeName = 'step' + this.active
    },
    // 当tab栏改变时触发
    handleClick (v) {
      // console.log(v)
      this.active = +v.index
    },
    handleRemove (file, fileList) {
      console.log(file)
      console.log(fileList)
      file.uid = null
      this.form.pics = []
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 当图片上传的钩子函数触发
    getPic (res, file, fileList) {
      if (res.meta.status === 200) {
        this.form.pics.push({
          pics: res.data.tmp_path
        })
      }
    },
    async complete () {
      const res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      const { status, msg } = res.meta
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style lang="scss">
.addGoods {
  .ql-container {
    height: 300px;
  }
}
</style>
