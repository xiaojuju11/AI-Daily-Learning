let res = `<script>alert('你被攻击了')</script>`

const xssTransform = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;'
}

res = res.replace(/<|>|&|'|"/g, (match) => xssTransform[match])

console.log(res)
