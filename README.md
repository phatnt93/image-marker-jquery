# image-marker-jquery
image-marker-jquery

```
<div style="width: 600px; margin: 0 auto;">
    <div id="img-marker">
        <img src="./img.jpg" alt="" >
    </div>
</div>
<link rel="stylesheet" href="./image-marker-v1.0.1/image-marker.css">
<script src="./image-marker-v1.0.1/image-marker.js"></script>
<script>
    $(document).ready(function(){
        window.imgMarker = $('#img-marker').imageMarker({
            marker: {
                image: './wifi-icon.png'
            }
        });
        window.imgMarker.afterClickImageCallBack = function(marker){
            marker.description = 12;
        };
    });
</script>
```
