{%- macro display_directories( dirs ) %}
	<ul class="hidden">
		{%- for dir, subdirs in dirs %}
			<li class="dir-entry">
				<p>
					<i class="fa fa-caret-right caret"></i>
					<span>{{ dir }}</span>
				</p>
				{%- if subdirs is not empty %}
					{{ display_directories( subdirs ) }}
				{%- endif %}
			</li>
		{%- endfor %}
	</ul>
{%- endmacro %}

<div class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5 mt5">Menedżer plików</h2>
	</div>
	<section class="filemanager white-back fill-free items-horizontal">
		<aside class="sidebar lightgrey-back items-vertical">
			<div class="breadcrumb items-horizontal">
				<i class="fa fa-home"></i>
				<span class="fill-free"></span>
				<i class="fa fa-refresh"></i>
			</div>
			<div class="directory-panel fill-free p05">
			</div>
		</aside>
		<div class="fill-free">
			<div class="breadcrumb items-horizontal">
				<p class="title root">Pulsar</p>
				<span class="fill-free"></span>
				<i class="fa fa-upload"></i>
				<i class="fa fa-folder"></i>
				<i class="fa fa-search"></i>
			</div>
		</div>
	</section>
</div>
