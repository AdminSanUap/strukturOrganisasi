class wpdevart_org_chart_front{
	constructor(container, options = {} ){
		var def_options = {
			mobile_frendly:'mobile',
			mobile_size: 450,
			def_scroll: 0,
		}
		this.options = Object.assign(def_options, options);
		var self = this;
		this.container=document.getElementById( container );
		this.container_id = this.container.getAttribute( "id" );
		this.container_width = this.container.clientWidth;
		if(options.mobile_frendly == 'mobile' || options.mobile_frendly == 'mob_view_only_on_mob'){	
			window.addEventListener('resize', function(){ 
				self.set_mobile_class(); 
				self.create_tree_line_mobile_css(); 
			});			
			self.container_width = self.container.clientWidth;
			self.set_mobile_class();
			self.create_tree_line_mobile_css();			
		}else{

			self.create_tree_line_mobile_css();	
		}
		self.set_def_scroll();		
	}

	set_mobile_class(){
		var self = this, check_only_mob = true, elementAfterMobile = document.getElementsByClassName('has_children chart_wpda_mobile_before');
		self.mob_width = Math.min( window.innerWidth, self.container.parentElement.parentElement.clientWidth );
		if(this.options.mobile_frendly == 'mob_view_only_on_mob'){
			check_only_mob = (window.innerWidth <= this.options.mobile_size)
		}
		if(self.mob_width <= self.container_width && check_only_mob){
			self.container.classList.add('wpda_mobile');
			self.container.setAttribute('style','');

			
		}else{
			self.container.classList.remove( 'wpda_mobile' );
			self.container.style.marginTop = "0";
	
		}
	}

	checkElementParentsHasClassName(element,nameOfClass){
		if (element.className.split(' ').indexOf(nameOfClass)>=0) 
			return true;
		return element.parentElement && this.checkElementParentsHasClassName(element.parentElement, nameOfClass);
	}

	set_def_scroll(){
		var self = this, scroll_pixels = 0, diff = 0;
		diff = (self.container.parentElement.parentElement.clientWidth - self.container_width)
		if(diff >= 0){
			return;
		}		
		scroll_pixels = parseInt( Math.abs( diff ) * self.options.def_scroll / 100 );
		self.container.parentElement.scrollTo( scroll_pixels, 0);
	}

	create_tree_line_mobile_css(){
		let self = this;
		if(self.container.classList.contains( 'first_child_hidden' ) && self.container.classList.contains( 'wpda_mobile' )){
			let firstElementHeight = self.container.getElementsByTagName( 'ul' )[0].getElementsByTagName( 'li' )[0].getElementsByTagName( 'ul' )[0].getElementsByTagName('li')[0].getElementsByClassName( 'wpda_tree_item_container' )[0].offsetHeight;
			let line_css = document.getElementById(self.container_id + "_line_css");		
			if(line_css == null){
				line_css = document.createElement("style");
				line_css.setAttribute("id", self.container_id + "_line_css");
				line_css.innerHTML = '.wpda_mobile.first_child_hidden#' + self.container_id + ' > ul > li > ul > li:first-child::before{top: ' + parseInt(firstElementHeight / 2) + 'px; height: calc(100% -  ' + parseInt( firstElementHeight / 2 ) + 'px); }';
				document.getElementsByTagName('body')[0].appendChild( line_css );				
			}else{
				line_css.innerHTML = '.wpda_mobile.first_child_hidden#' + self.container_id + ' > ul > li > ul > li:first-child::before{top: ' + parseInt(firstElementHeight/2) + 'px; height: calc(100% -  ' + parseInt(firstElementHeight/2) + 'px); }';
			}
		}		
	}	
}