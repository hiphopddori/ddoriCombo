/* @remark  : multiselect box
   @author  : made in Cheol(Hiphopddori)
   @version : 0.1.0
*/
;(function ( $, window, document, undefined ) {

	var pluginName = "ddoriSelect",
	defaults = {
			propertyName: "default"
			,mode:"single"                    //selectMode
			,isOpen :false                    //기본 open 여부
			,width:"120px"                    //기본 너비값
   		    ,nameField:"name"                 //화면에 보여줄 field   		
   		    ,keyField:"code"                  //code 필드
			,multiSelectAllName : "Select All"
			,multiSelectTitle:"Choice"
			,multiDefaultSelectAll:true       //multi Mode 일경우 디폴터 선택 여부			
			,selectedIndex:0                  //single Mode default Index
			,includeAll:false                 //전체 추가 여부
			,checkListData:null
			,clickEvent:null				  //Click event      
			,enabled:true
			,allChkToNullReturn:false
	};

  //construct
	function Plugin( element, options ) {	  
		var that = this;	  
		this.element = element;
		this.options = $.extend( {}, defaults, options) ;				
		this._makeCombo();		
	}
  
  //protoType
	Plugin.prototype = {
	    
	    allText : '전체' , 
	  
		init: function() {
			   //이벤트 등록
	         this._addEvents();
	         
	         this.$selectedIndex = 0;
	         //this.options.enabled = true;
	         
	         if (this.options.mode == "single"){
	            this.setSelectedIndex(this.options.selectedIndex);
	         }
	         
	         var nAddIdx = 0;         
	         if (this.options.includeAll){
	             nAddIdx--;  
	         }           
	         //개별 select 데이타 index 등록         
	         $(this.$selectPart).each(function( index ) {
	             $(this).data("index",index);
	             $(this).data("dataIndex",index+nAddIdx);
	         });   	         
		},
			
		_makeCombo:function (){
			  
	        var that= this;
			this.$choice = $('<a class="current">'+this.options.multiSelectTitle+'</a>');     			  
	       	var html = [];
	        html.push('<ul>');
	        
	        if (this.options.mode == "multi"){
	            
	           //Default Select All
	           var checkedValue = "checked";     
	            
	           if (!this.options.multiDefaultSelectAll){
	             checkedValue = "";
	           }  
	           
	           //전체    
	           html.push('<li><label><input type="checkbox" name="selectAll" '+checkedValue+'>'+this.options.multiSelectAllName+'</label></li>');       
	           
	         //개별 체크
	           /*
	           if (this.options.checkListData != null){
	        	   $.each(this.options.checkListData, function (i, val) {        
		               html.push('<li><label><input type="checkbox" name="selectPart" '+checkedValue+'>'+val[that.options.nameField]+'</label></li>');        
		           });      
	           }
	           */
	           var checkedCnt = 0;
	           if (this.options.checkListData != null){
	        	   $.each(this.options.checkListData, function (i, val) {   
	        		   
	        		   if (val.hasOwnProperty("checked")){
	        			   
	        			   if (val.checked == "1"){
	        				   html.push('<li><label><input type="checkbox" name="selectPart" '+'checked'+'>'+val[that.options.nameField]+'</label></li>');
	        				   checkedCnt++;
	        			   }else{
	        				   html.push('<li><label><input type="checkbox" name="selectPart" '+''+'>'+val[that.options.nameField]+'</label></li>');
	        			   }
	        			   
	        		   }else{
	        			   html.push('<li><label><input type="checkbox" name="selectPart" '+checkedValue+'>'+val[that.options.nameField]+'</label></li>');
	        			   
	        			   if (checkedValue == "checked"){
	        				   checkedCnt++;
	        			   }	        			   
	        		   }
	        		           
		           });      
	           }	           
	           this.close();
	           
	        }else{
	          
	          if (this.options.includeAll){
	               html.push('<li><a href="#" name="selectPart">'+this.allText+'</a></li>');      
	          }  
	          
	          if (this.options.checkListData != null){
	        	  $.each(this.options.checkListData, function (i, val) {        
		               html.push('<li><a href="#" name="selectPart">'+val[that.options.nameField]+'</a></li>');    
		          });      
	          }	          
	        }  
	        
	        html.push('</ul>');
	        
	        this.classInit();	       	
	        //$(this.element).addClass("selectBox");
	        $(this.element).css("width",this.options.width);
	        
	       	$(this.element).append(this.$choice);
	     	$(this.element).append(html.join(''));   	
	       	
	       	this.$selectAll = $(this.element).find('[name="selectAll"]');
	       	this.$selectPart = $(this.element).find('[name="selectPart"]');
	       	
	       	
	       	if (this.options.mode == "multi"){
	       		if (this.options.checkListData != null){	       			
	       			this.close();	       			
	       		}
	       	}
	       	
	    	this.init();  			 
		},
			
		_addEvents: function () {
        
	        var that = this;
	        
	        function _toggleOpen(e) {
	           e.preventDefault();
	           that[that.options.isOpen ? 'close' : 'open']();
	        }
        
	        if (this.options.mode == "multi"){
	            //전체 선택 이벤트 
	            this.$selectAll.off('click').on('click', function () {
	               
	            	if (that.options.enabled){
	            		$(that.$selectPart).prop('checked',$(this).is(":checked"));                         
	 	                //$(this.element).attr("class","selectBox on");
	            		$(this.element).addClass("on");
	            	}	            	
	            });
	        }else{
	          //개별 선택 이벤트
	            this.$selectPart.off('click').on('click', function (event) {              	               
		            
	            	if (that.options.enabled){
	            		that.setSelectedIndex($(this).data("index"));      
			            
			            if (that.options.clickEvent != null){                 
			                 that.options.clickEvent.call();   
			            }
			            
			            that.close();
	            	}	            	
	           });          
	        }  
        
	        this.$choice.off('click').on('click', _toggleOpen);     
	        
	        $(this.element).mouseleave(function(){
	    			that.close();
	    		});        
		} ,
			
		_getDataIndex:function(){
			   
	        var dataIndex=this.$selectedIndex; 
	        
	        if (this.options.includeAll){
	          dataIndex--;        
	        } 
	        return dataIndex; 			      			    
		}  			
		, classInit:function(){
			$(this.element).addClass("selectBox");
			$(this.element).removeClass("on");
			$(this.element).removeClass("focus");
			
		}
		, getPropertyName : function(){
			return this.options.propertyName;
		},
			
		getItemData :function(){
			  return this.options.checkListData;
		} ,
		
		/* 콤보박스 enabled 처리 
		 */
		setEnabled : function(bEnable){
									
			if (bEnable){
				this.options.enabled = true;
				$(this.element).removeClass("dis");				
			}else{
				this.options.enabled = false;
				$(this.element).addClass("dis");															
			}
			
		} ,
		
		/* remark : 선택된 값을 얻는다.
			   param  : dataField -> 얻으려는 Key값
		*/		
		getSelectedItemValue :function(dataField){
		   	   
		   var that = this;
			   
		   if (this.options.mode == "multi"){
			   
			   var nDataCnt = 0;
			   var selCnt = 0;
		       var arChkData = [];			           
		       $(this.$selectPart).each(function( index ) {
		    	   nDataCnt++;
			       if ($(this).is(":checked")){            	   
			    	   selCnt++;  
			    	   arChkData.push(that.options.checkListData[index][dataField]);                                          
	               }                
		       });		
		       
		       if (this.options.allChkToNullReturn){
		    	   if (nDataCnt == selCnt){
		    		   return null;
		    	   }else{
		    		   return arChkData;
		    	   }
		       }else{
		    	   return arChkData;
		       }
		       
		        
			}else{			     			      
			   var chkData = "";   
			   if (this.options.includeAll && this.$selectedIndex ==0){
			        chkData = "";
			   }else{
			        
				   if (this.options.checkListData != null){
					   if (this.options.checkListData.length > 0){
						   chkData = this.options.checkListData[this._getDataIndex()][dataField];
					   }
				   } 				                                                 
			   }			     
			   return chkData; 			     
			 } 			   
		} ,
		/* remark : 데이타에 따른콤보 다시 생성
		*/
		setReload:function(arData){
		   
		   $(this.element).empty();				   
		   this.options.checkListData = arData;			   
		   this._makeCombo();
		   
		} ,
			
		setSelectedIndex:function(index){
		    
		    if (this.options.includeAll && index == 0){
		        this.$choice.html(this.allText); 
		    }else{
		    	
		    	if (this.options.checkListData != null){
		    		
		    		if (this.options.checkListData.length > 0){
		    			var dataIndex=index; 
				        
				        if (this.options.includeAll){
				          dataIndex--;        
				        }  			      
				        this.$choice.html(this.options.checkListData[dataIndex][this.options.nameField]);
		    		} 		    		
		    	}		        
		    }   
		    this.$selectedIndex = index;			    
		} ,
		
		setSelectedToArray: function(key,selData){			   
			   var nSelectedIndex = 0;
			   var bSel = false;
			   $.each(this.options.checkListData, function (i, val) {        			     
				   bSel = false;
				   $.each(selData, function(selIdx, selVal){					   
					   if (val[key] == selVal){
						   bSel = true;
						   return true;
					   }					   
				   });
				   
				   if (bSel){
					   val.checked = "1";  	
				   }else{
					   val.checked = "0";  	
				   }				   
			   });  
			   
			   this.setReload(this.options.checkListData);			   		   			  
		},
				
		setSelectedItem: function(key,checkValue,defaultIndex){
		  			   
		   var nSelectedIndex = 0;	
		   var bFinded = false;
		   $.each(this.options.checkListData, function (i, val) {        			     
		       if (val[key] == checkValue){
		          nSelectedIndex = i;
		          bFinded = true;
		          return false;  
		       }
		   });  
		   
		   if (bFinded){
			   //전체포함일경우 전체가 있기떄문에 ++ 한다.
			   if (this.options.includeAll){
				   nSelectedIndex++;
			   }
		   }
		   
		   if ( defaultIndex !== undefined && nSelectedIndex == 0 ) {
		        nSelectedIndex = defaultIndex;     
		   }   
		   
		   this.setSelectedIndex(nSelectedIndex);
		   
	   },
			
       open: function () {
           
    	   if (!this.options.enabled){
    		   return;
    	   } 
    	   
    	   this.options.isOpen = true;
           //$(this.element).attr("class","selectBox on");
    	   $(this.element).addClass("on");
    	   
       } ,
      
      close: function () {
        
    	  if (!this.options.enabled){
    		  return;
    	  }
    	  
    	 this.options.isOpen = false;
         //$(this.element).attr("class","selectBox");
    	 this.classInit();
         
         if (this.options.mode == "multi"){             
             //선택된값 
             var nCheckedCnt = 0;
             var arTitle= [];
             $(this.$selectPart).each(function( index ) {
                  if ($(this).is(":checked")){
                    arTitle.push($(this).parent('label').text());
                    nCheckedCnt++;  
                  }                
             });
             
             //전체 선택이 아닐경우 음영처리 해준다.
             if (nCheckedCnt != this.options.checkListData.length){
                //$(this.element).attr("class","selectBox focus");
            	 $(this.element).addClass("focus");
             }else{            	 
                //$(this.element).attr("class","selectBox");
            	 $(this.element).addClass("selectBox");                
             } 
             //선택된부분 툴팁 처리
             
             if (nCheckedCnt == 0){
                this.$choice.attr("title","선택된 정보가 없습니다.");                
             }else{
                this.$choice.attr("title",arTitle.join(','));           
             }             
         }           
      }   			
	};

  //외부 노출 jQuery Plugin
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
						new Plugin( this, options ));
			}
		});
	};
	
	
})( jQuery, window, document );


//jQuery Ddori Combo 확장 함수 
jQuery.fn.extend({		
	//ddoriCombo Action 처리
	ddoriCombo: function(action,options) {
		
		var $cboDdori =  $(this).data('ddoriSelect'); 
		//var $cboDdori =  this.data('ddoriSelect');
		//var $cboDdori =  $(this.selector).data('ddoriSelect'); 
		
		if (action == 'getSelectedItem'){				
			var selectItem = $cboDdori.getSelectedItemValue(options);		
			return selectItem;
		}else if (action == 'setSelectedIndex'){							
			$cboDdori.setSelectedIndex(options);
		}else if (action == 'setEnabled'){
			$cboDdori.setEnabled(options);
		}else if (action == 'setReload'){
			$cboDdori.setReload(options);
		}else if (action == 'setSelectedItem'){					
			$cboDdori.setSelectedItem(options.dataField , options.data , 0);
		}else if(action == 'setSelectedToArray'){
			$cboDdori.setSelectedToArray(options.dataField , options.data);
		}
		
		return;
	}		
});



