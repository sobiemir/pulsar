
<aside id="pagebar" class="items-vertical" style="width:300px;">
	<div class="breadcrumb no-padding items-horizontal">
		<span class="text-right fill-free"><i class="fa fa-bars"></i></span>
		<span class="text-right"><i class="fa fa-arrow-circle-o-left"></i></span>
	</div>
	
	<ul class="pagemenu fill-free">

	{% for menu in menus %}
		<li class="menu-entry items-horizontal">
			<span class="grey fill-free">{{ menu.name }}</span>
			<div class="action-container hidden">
				<a href="/admin/menu/edit/{{menu.getId()}}"
					class="fa fa-pencil edit">
				</a>
			</div>
		</li>
	{% endfor %}

	</ul>
</aside>

<div class="menu-slider"></div>
