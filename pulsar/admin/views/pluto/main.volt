<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="icon" href="/themes/pluto/favicon.ico">

	<title>{{ title }}</title>

	<!-- style -->
	{{ stylesheet_link("css/admin") }}
	{{ stylesheet_link("vendors/css/font-awesome") }}

	<!-- skrypty JS -->
	{{ javascript_include("js/static") }}
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

		<!-- pasek boczny z listą menu, stron i artykułów -->
		{{ partial("partial/pages") }}

		<main class="w100p items-vertical fill-free">

			<!-- nawigacja okruszkowa -->
			{{ partial("partial/breadcrumbs") }}

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
