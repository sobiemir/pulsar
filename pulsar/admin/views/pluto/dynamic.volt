<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="icon" href="/themes/pluto/favicon.ico">

	<title>{{ title }}</title>

	{{ javascript_include(["lib/require", "data-main": "main"]) }}
	{{ stylesheet_link("loading") }}
</head>
<body class="items-vertical">
	<div id="loading-screen">
		{{ tag.logo(96) }}
		<p id="qp-p">...wczytywanie danych...</p>

		<div id="qp-b">
			<div id="qp-i"></div>    
		</div>
	</div>
	<header id="header" class="w100p items-horizontal">
		{{ tag.logo(48, '#e4e4e4') }}
		<div class="items-vertical items-center">
			<h1>Pulsar</h1>
			<h2>Panel Administracyjny</h2>
		</div>
		<div id="navigation" class="items-vertical items-bottom">
			<aside class="items-horizontal">
				<a class="fa fa-user"></a>
				<a class="fa fa-wpforms"></a>
				<a class="fa fa-sign-out"></a>
			</aside>
			<nav>
				<a class="menu-position">Kokpit</a>
				<span class="menu-position">Treść
					<ul class="submenu">
						<li class="items-horizontal">
							<span class="menu-icon">&raquo;</span>
							<a class="menu-caption" href="{{ url('/admin/menu') }}">Menu</a>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-commenting-o"></span>
							<a class="menu-caption" href="{{ url('/admin/translations') }}">Tłumaczenia...</a>
						</li>
						<li class="separator">
							<span class="menu-icon"></span>
							<span class="menu-caption"></span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-folder"></span>
							<a class="menu-caption" href="{{ url('/admin/pages') }}">Strony</a>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-file-o"></span>
							<a class="menu-caption" href="{{ url('/admin/articles') }}">Artykuły</a>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-book"></span>
							<a class="menu-caption" href="{{ url('/admin/categories') }}">Kategorie</a>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-tags"></span>
							<a class="menu-caption" href="{{ url('/admin/tags') }}">Tagi</a>
						</li>
						<li class="separator">
							<span class="menu-icon"></span>
							<span class="menu-caption"></span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon">&raquo;</span>
							<a class="menu-caption" href="{{ url('/admin/media') }}">Lista plików</a>
						</li>
					</ul>
				</span>
				<span class="menu-position">Dodatki
					<ul class="submenu">
						<li class="items-horizontal">
							<span class="menu-icon fa fa-cube"></span>
							<span class="menu-caption">Administracja...</span>
						</li>
					</ul>
				</span>
				<span class="menu-position">Narzędzia
					<ul class="submenu">
						<li class="items-horizontal">
							<span class="menu-icon">&raquo;</span>
							<span class="menu-caption">Menedżer plików</span>
						</li>
						<li class="separator">
							<span class="menu-icon"></span>
							<span class="menu-caption"></span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-bar-chart"></span>
							<span class="menu-caption">Statystyki...</span>
						</li>
						<li class="separator">
							<span class="menu-icon"></span>
							<span class="menu-caption"></span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-heartbeat"></span>
							<span class="menu-caption">Diagnostyka</span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-wrench"></span>
							<span class="menu-caption">Konserwacja</span>
						</li>
					</ul>
				</span>
				<span class="menu-position">Ustawienia
					<ul class="submenu">
						<li class="items-horizontal">
							<span class="menu-icon fa fa-eye"></span>
							<span class="menu-caption">Interfejs</span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon">&raquo;</span>
							<span class="menu-caption">Strona...</span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-gear"></span>
							<span class="menu-caption">Zaawansowane...</span>
						</li>
						<li class="separator">
							<span class="menu-icon"></span>
							<span class="menu-caption"></span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-globe"></span>
							<span class="menu-caption">Języki</span>
						</li>
						<li class="items-horizontal">
							<span class="menu-icon fa fa-users"></span>
							<span class="menu-caption">Użytkownicy...</span>
						</li>
					</ul>
				</span>
				<a class="menu-position">Pomoc</a>
			</nav>
		</div>
	</header>

	<div id="main" class="items-horizontal fill-free">
		<aside class="pagebar w30p items-vertical" style="width:340px;">
			<div class="breadcrumb no-padding items-horizontal">
				<span class="text-right fill-free"><i class="fa fa-bars"></i></span>
				<span class="text-right"><i class="fa fa-arrow-circle-o-left"></i></span>
			</div>
			<div class="pagemenu fill-free">
			</div>
		</aside>

		<div class="menu-slider"></i></div>

		<main class="w100p items-vertical">
			{{ get_content() }}
		</main>
	</div>
</body>
</html>
