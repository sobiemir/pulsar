<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="icon" href="/themes/pluto/favicon.ico">

	<title>{{ title }}</title>

	<!-- style -->
	{{ stylesheet_link("css/admin") }}
	{{ stylesheet_link("vendors/css/font-awesome") }}

	<!-- skrypty JS -->
	{{ javascript_include('js/app.static') }}
</head>
<body class="items-vertical">
	<header id="header" class="w100p items-horizontal">
		
		<!-- logo Pulsar CMS wraz z nazwą -->
		{{ tag.logo(48, '#EEE', '#c91111') }}

		<div class="items-vertical items-center">
			<h1>Pulsar</h1>
			<h2>Panel Administracyjny</h2>
		</div>

		<!-- nagłówek -->
		<div id="navigation" class="items-vertical items-bottom">
			<i id="version-info">pr-0.0.1-uv (genesis)</i>
			<aside class="items-horizontal">
				<a class="fa fa-user"></a>
				<a class="fa fa-wpforms"></a>
				<a class="fa fa-sign-out"></a>
			</aside>

			<!-- menu główne -->
			{{ partial("partial/menu") }}
		</div>
	</header>

	<div id="main" class="items-horizontal fill-free">
		<aside id="pagebar" class="items-vertical" style="width:300px;">
			<div class="breadcrumb no-padding items-horizontal">
				<span class="text-right fill-free"><i class="fa fa-bars"></i></span>
				<span class="text-right"><i class="fa fa-arrow-circle-o-left"></i></span>
			</div>
			<div class="pagemenu fill-free">
			</div>
		</aside>

		<div class="menu-slider"></div>

		<main class="w100p items-vertical fill-free">

			<!-- nawigacja na samej górze strony z przyciskami -->
			<div class="breadcrumb items-horizontal">

				<!-- informacja o aktualnym położeniu - nawigacja okruszkowa -->
				{% if breadcrumb is defined %}
					<p class="title">
						{% for bc in breadcrumb %}
							<a href="{{ bc['url'] }}">{{ bc['name'] }}</a>
							<span class="raquo">&raquo;</span>
						{% endfor %}
					</p>
				{% endif %}

				<!-- przyciski dla strony -->
				{% if topButtons is defined %}
					<div class="button-container items-horizontal fill-free text-right">
						<span class="fill-free"></span>
						{% for button in topButtons %}
							<a id="{{ button['id'] }}" class="button simple {{ button['class'] }}"
								title="{{ button['name'] }}" href="{{ button['url'] }}">
							</a>
						{% endfor %}
					</div>
				{% endif %}
			</div>

			<!-- treść -->
			{{ get_content() }}

		</main>

		<!-- pasek boczny - nie zawsze jest dostępny -->
		{% if hasSidebar %}
			{{ partial("partial/settings") }}
		{% endif %}
	</div>
</body>
</html>
