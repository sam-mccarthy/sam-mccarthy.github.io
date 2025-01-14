const canvas = document.getElementById('fluid')
if(canvas.getContext){
    const ctx = canvas.getContext("2d")

    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}