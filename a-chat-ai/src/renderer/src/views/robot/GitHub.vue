<script setup>
import router from "../../router";
const goToWebsite=()=>{
  preApi.openLink("http://baidu.com")
}
goToWebsite()
router.push('/main/robot')
</script>
