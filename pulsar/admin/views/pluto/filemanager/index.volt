{{ javascript_include("vendors/js/doT.min") }}
{{ javascript_include("vendors/js/qwest.min") }}

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
				<ul class="directory-tree">
				</ul>
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
			<div class="entity-panel fill-free p05">
			</div>
		</div>

		<script type="text/template" id="tpl-entity-item">
			<ul>
				<%~ it :value %>
					<li>
						<%= value.name %>
					</li>
				<%~%>
			</ul>
		</script>
		<script type="text/template" id="tpl-directory-item">
			<li class="dir-entry">
				<div>
					<p data-click="browse">
						<i class="fa fa-angle-right caret <%? !it.children.length %>invisible<%?%>" data-click="toggle"></i>
						<i class="fa fa-folder folder-icon"></i>
						<span><%= it.name %></span>
					</p>
				</div>
				<ul class="directory-subtree hidden"></ul>
			</li>
		</script>

	</section>
</div>
