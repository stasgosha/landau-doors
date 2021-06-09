document.addEventListener('DOMContentLoaded', function(){

	const isRTL = $('html').attr('dir') == 'rtl';
	const isMobile = $(window).width() < 992;

	if (isRTL) {
		$('.wpcf7').attr('dir','rtl');
	} else{
		$('.wpcf7').attr('dir','ltr');
	}

	function is_touch_device() {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	}

	if(is_touch_device()){
		$('body').addClass('touch');
	} else{
		$('body').addClass('no-touch');
	}

	// Sliders
	function equalSlideHeight(slider){
		$(slider).on('setPosition', function () {
			$(this).find('.slick-slide').height('auto');
			var slickTrack = $(this).find('.slick-track');
			var slickTrackHeight = $(slickTrack).height();
			$(this).find('.slick-slide').css('height', slickTrackHeight + 'px');
		});
	}

	let arrowsButtons = {
		prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.4 52.75"><path data-name="Path 23" d="M1 .35l25.7 26.34L.35 52.4" fill="none" stroke="#2f2970" stroke-miterlimit="10"/></svg></button>',
		nextArrow: '<button type="button" class="slick-next" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.4 52.75"><path data-name="Path 70" d="M26.4 52.4L.7 26.05 27.05.35" fill="none" stroke="#2f2970" stroke-miterlimit="10"/></svg></button>'
	}

	$('.first-screen-slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		...arrowsButtons,
		dots: false,
		infinite: true,
		autoplaySpeed: 7000,
		speed: 800,
		rtl: isRTL,
		asNavFor: '.first-screen-slider-nav',
		cssEase: 'ease-in-out',
		touchThreshold: 100,
		draggable: true,
		autoplay: true,
		fade: true,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					dots: true
				}
			}
		]
	});
	$('.first-screen-slider-nav').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  infinite: true,
	  autoplay: false,
	  rtl: isRTL,
	  asNavFor: '.first-screen-slider',  
	  cssEase: 'ease-in-out',
	  touchThreshold: 100,
	  draggable: true,
	  fade: true,
	});

	$('.products-slider').slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		arrows: true,
		...arrowsButtons,
		dots: false,
		infinite: true,
		speed: 600,
		rtl: isRTL,
		responsive: [
			{
				breakpoint: 576,
				settings: 'unslick'
			}
		]
	});

	equalSlideHeight('.products-slider');

	// $('.slider-img').slick({
	// 	slidesToShow: 1,
	// 	slidesToScroll: 1,
	// 	arrows: false, 
	// 	dots: false, 
	// 	// infinite: true,
	// 	asNavFor: '.slider-info',
	// 	speed: 800,
	// 	rtl: isRTL,  
	// });
	// $('.slider-info').slick({
	//   slidesToShow: 3,
	//   slidesToScroll: 1,
	//   arrows: false, 
	//   dots: false, 
	// //   infinite: true,  
	//   vertical: true,
	//   asNavFor: '.slider-img',    
	// });

	// Questions
	$('.questions-component').each(function(i, el){
		$(el).find('.answers').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			fade: true,
			speed: 600,
			swipe: false,
			rtl: isRTL, 
		});

		$(el).find('.questions li').append('<div class="item-line"></div>');

		equalSlideHeight($(el).find('.answers'));

		$(el).find('.questions button').click(function(e){
			e.preventDefault();

			let slideIndex = parseInt( $(this).closest('li').data('slide') );

			$(this).closest('li').addClass('current').siblings().removeClass("current");

			$(el).find('.answers').slick('slickGoTo', slideIndex);
		});

		$(el).find('.questions button').eq(0).trigger('click');
	});
	// Scroll to anchor
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		if ($.attr(this, 'href') === '#') {
			return false;
		}

		let offset = 0;

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top - offset
		}, 500);
	});

	// Menu opener
	$('.menu-opener').click(function(e){
		e.preventDefault();

		$('.menu-opener').toggleClass('active');
		$('.mobile-top-nav').toggleClass('opened');
		$('.header').toggleClass('nav-opened');
	});

	// Sticky Header
	function stickyHeader(){
		let header = document.querySelector('.header');

		if (!!header) {
			window.scrollY > 100
				? header.classList.add('sticky')
				: header.classList.remove('sticky');
		};
	}


	window.addEventListener('scroll', stickyHeader);
	setTimeout(stickyHeader, 100);

	// Modals
	$('.modal').css('display','block');

	$('.modal-dialog').click(e => e.stopPropagation());
	$('.modal').click(function(e){
		hideModal( $(this) );
		$('.video-modal .modal-video').html('<div id="modal-video-iframe"></div>');
	});

	$('.modal-close, .js-modal-close').click(function(e){
		e.preventDefault();

		hideModal( $(this).closest('.modal') );
		$('.video-modal .modal-video').html('<div id="modal-video-iframe"></div>');
	});

	$('[data-modal]').click(function(e){
		e.preventDefault();
		e.stopPropagation();

		hideModal('.modal');

		if ($(this).data('modal-tab') != undefined) {
			goToTab($(this).data('modal-tab'));
		}

		showModal( $(this).data('modal') );
	});

	// Video
	$('.video-block:not([data-video-modal])').on('click', function () {
		$(this).addClass('playing');
		$(this).find('.block-overlay').fadeOut(300);

		let videoId = $(this).find('.play-btn').data('video-id');

		if (!videoId) {
			videoId = $(this).data('video-id');
		}

		if (videoId == undefined) {
			$(this).find('video')[0].play();
		} else{
			let videoType = $(this).data('video-type') ? $(this).data('video-type').toLowerCase() : 'youtube';

			if (videoType == 'youtube') {
				$(this).find('.block-video-container').append('<div class="video-iframe" id="'+videoId+'"></div>');
				createVideo(videoId, videoId);
			} else if(videoType == 'vimeo'){
				$(this).find('.block-video-container').append('<div class="video-iframe" id="'+videoId+'"><iframe allow="autoplay" class="video-iframe" src="https://player.vimeo.com/video/'+videoId+'?playsinline=1&autoplay=1&transparent=0&app_id=122963"></div>');
			}
		}
	});

	$('[data-video-modal]').click(function(e){
		e.preventDefault();
		e.stopPropagation();

		let videoId = $(this).data('video-modal');
		let videoType = $(this).data('video-type');

		if (videoType == 'youtube') {
			$('#modal-video-iframe').removeClass('vimeo youtube').addClass('youtube').append('<div class="video-iframe" id="'+videoId+'"></div>');
			createVideo(videoId, videoId);
		} else if(videoType == 'vimeo'){
			$('#modal-video-iframe').removeClass('vimeo youtube').addClass('vimeo').html('<iframe class="video-iframe" allow="autoplay" src="https://player.vimeo.com/video/'+videoId+'?playsinline=1&autoplay=1&transparent=1&app_id=122963">');
		}

		hideModal('.modal');

		showModal( "#video-modal" );
	});

	var player;
	function createVideo(videoBlockId, videoId) {
		player = new YT.Player(videoBlockId, {
			videoId: videoId,
			playerVars: {
				'autohide': 1,
				'showinfo' : 0,
				'rel': 0,
				'loop': 1,
				'playsinline': 1,
				'fs': 0,
				'allowsInlineMediaPlayback': true
			},
			events: {
				'onReady': function (e) {
					// e.target.mute();
					// if ($(window).width() > 991) {
						setTimeout(function(){
							e.target.playVideo();
						}, 200);
					// }
				}
			}
		});
	}
});


function getScrollWidth(){
	// create element with scroll
	let div = document.createElement('div');

	div.style.overflowY = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';

	document.body.append(div);
	let scrollWidth = div.offsetWidth - div.clientWidth;

	div.remove();

	return scrollWidth;
}

let bodyScrolled = 0;
function showModal(modal){
	$(modal).addClass('visible');
	bodyScrolled = $(window).scrollTop();
	$('body').addClass('modal-visible')
			 .scrollTop(bodyScrolled)
			 .css('padding-right', getScrollWidth());
}

function hideModal(modal){
	$(modal).removeClass('visible');
	bodyScrolled = $(window).scrollTop();
	$('body').removeClass('modal-visible')
			 .scrollTop(bodyScrolled)
			 .css('padding-right', 0);
}