/*
    Image Marker
    By Phat
    
    Github: https://github.com/phatnt93

    version 1.0.2

    Example: 

    $('#img-marker').imageMarker({
        marker: {
            image: './wifi-icon.png'
        }
    });
    
*/

(function( $ ){
    $.fn.imageMarker = function(opts = {}) {
        class Marker{
            id = '';
            text = '';
            description = '';
            image = '';
            position = {x: 0, y: 0};
            width = 0;
            height = 0;
            imgCoreOrigin = {width: 0, height: 0};
            imgCoreChange = {width: 0, height: 0};;

            constructor(params = {}) {
                $.extend(true, this, params);
            }

            renderImage(){
                let render = `<div class="img-maker-item">`;
                if(this.image.localeCompare('') > 0){
                    render += `<img src="${this.image}">`;
                }
                render += `</div>`;
                return render;
            }

            renderMarker(){
                let changeX = this.position.x;
                let changeY = this.position.y;
                if(this.imgCoreChange.width > 0 && this.imgCoreChange.height > 0){
                    changeX = this.position.x + this.position.x * ((this.imgCoreChange.width - this.imgCoreOrigin.width)/this.imgCoreOrigin.width) ;
                    changeY = this.position.y + this.position.y * ((this.imgCoreChange.height - this.imgCoreOrigin.height)/this.imgCoreOrigin.height) ;
                }
                // Move marker to center
                changeX = changeX - this.width/2;
                changeY = changeY - this.height/2;
                
                let render = `<div class="marker" title="${this.description}" data-id="${this.id}" style="left: ${changeX}px; top: ${changeY}px; width: ${this.width}px; height: ${this.height}px">${this.renderImage()}</div>`;
                return render;
            }
        }
        
        var imageMarker = this;
        this.settings = {
            classWrap: 'img-marker-wrap' + Date.now(),
            marker: {
                image: '',
                width: 20,
                height: 20
            }
        }
        $.extend(true, this.settings, opts);
        this.markers = [];
        this.imgCore = $(this).find('img');

        /**
         * 
         * @param {Marker} marker 
         */
        this.addMarker = function(marker){
            this.markers.push(marker);
        };

        /**
         * 
         * @param {Marker[]} markers 
         */
        this.setMarkers = function(markers){
            this.markers = markers;
        }

        /**
         * 
         * @param {Marker} marker 
         */
        this.updateMarker = function(marker){
            let mks = this.getMarkers();
            for(let i = 0; i < mks.length; i++){
                if(mks[i].id == marker.id){
                    this.markers[i] = marker;
                    return true;
                }
            }
            return false;
        }
        

        /**
         * 
         * @returns {Marker[]}
         */
        this.getMarkers = function(){
            return this.markers;
        };

        /**
         * @param {String} id
         * @returns {Marker}
         */
        this.getMarker = function(id){
            let mks = this.getMarkers();
            for(let i = 0; i < mks.length; i++){
                if(mks[i].id == id){
                    return mks[i];
                }
            }
            return false;
        };

        this.resetMarkers = function() {
            this.markers = [];
        };

        this.randomNumber = function(){
            return Math.floor((Math.random() * 100) + 1)
        };

        this.renderDescription = function(des){
            $(imageMarker).find('.text-note').remove();
            $(imageMarker).append(`
                <div class="text-note">
                    ${des}
                    <div class="close-note"> --close-- </div>
                </div>
            `);
        };
        
        /**
         * 
         * @param {Marker[]} markers
         */
        this.renderMarkers = function(markers){
            // Remove all markers on image
            $(this).find('.marker').remove();
            // Render all markers
            for (let i = 0; i < markers.length; i++) {
                $(imageMarker).append(markers[i].renderMarker());
            }
        }

        this.reloadMarkers = function(){
            this.renderMarkers(this.getMarkers());
        }

        this.removeAllMarkers = function(){
            $(this).find('.marker').remove();
            this.resetMarkers();
        }

        this.removeMarker = function(marker){
            let mks = this.getMarkers();
            imageMarker.resetMarkers();
            for(let i = 0; i < mks.length; i++){
                if(mks[i].id != marker.id){
                    imageMarker.addMarker(mks[i]);
                }
            }
            imageMarker.reloadMarkers();
            return true;
        }
        
        /**
         * 
         * @param {Object[]} markers 
         */
        this.importMarkers = function(markers = []){
            this.removeAllMarkers();
            for(let i = 0; i < markers.length; i++){
                let marker = new Marker(markers[i]);
                marker.image = imageMarker.settings.marker.image;
                marker.width = imageMarker.settings.marker.width;
                marker.height = imageMarker.settings.marker.height;
                marker.imgCoreChange.width = $(imageMarker.imgCore).width();
                marker.imgCoreChange.height = $(imageMarker.imgCore).height();
                imageMarker.addMarker(marker);
            }
            this.reloadMarkers();
        }

        /**
         * 
         * @param {Marker} maker 
         */
        this.afterClickImageCallBack = function(maker){};
        
        $(this).on('click', '#img-core', function(e){
            e.preventDefault();
            let img = $(this);
            let item = new Marker({
                id: Date.now().toString() + imageMarker.randomNumber().toString(),
                description: Date.now().toString(),
                image: imageMarker.settings.marker.image,
                position: {
                    x: e.offsetX,
                    y: e.offsetY
                },
                imgCoreOrigin: {
                    width: img.width(),
                    height: img.height()
                },
                imgCoreChange: {
                    width: img.width(),
                    height: img.height()
                },
                width: imageMarker.settings.marker.width,
                height: imageMarker.settings.marker.height
            });
            imageMarker.addMarker(item);
            imageMarker.renderMarkers(imageMarker.getMarkers());
            imageMarker.afterClickImageCallBack(item);
        });

        $(this).on('mouseover', '.marker', function(e){
            let markerID = $(this).data('id');
            if(markerID != undefined){
                let marker = imageMarker.getMarker(markerID);
                imageMarker.renderDescription(marker.description);
            }
        });

        $(this).on('click', '.close-note', function(e){
            $(imageMarker).find('.text-note').hide();
        });

        this.init = function(){
            $(imageMarker).addClass(imageMarker.settings.classWrap);
            $(imageMarker).addClass('img-marker');
            imageMarker.imgCore.attr('id', 'img-core');
        };
        this.init();
        
        return this;
    }; 
 })( jQuery );