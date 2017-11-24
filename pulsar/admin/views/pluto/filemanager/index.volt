{{ javascript_include("vendors/js/doT.min") }}
{{ javascript_include("vendors/js/qwest.min") }}

<div class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5 mt5">Menedżer plików</h2>
	</div>
	<section class="filemanager white-back fill-free items-horizontal">
		<aside class="sidebar lightgrey-back items-vertical">
			<div class="breadcrumb items-horizontal">
				<i id="FM_Home" class="fa fa-home"></i>
				<span class="fill-free"></span>
				<i id="FM_Refresh" class="fa fa-refresh"></i>
			</div>
			<div class="directory-panel fill-free p05">
				<div id="FM_DirectoryLoad" class="loader"></div>
				<ul class="directory-tree">
				</ul>
			</div>
		</aside>
		<div class="fill-free items-vertical">
			<div class="breadcrumb items-horizontal">
				<i class="fa fa-level-up" id="FM_GoUp"></i>
				<p class="title root">Pulsar</p>
				<span class="fill-free"></span>
				<i class="fa fa-upload"></i>
				<i class="fa fa-folder"></i>
				<!-- <i class="fa fa-search"></i> -->
			</div>
			<div class="entity-panel fill-free p05">
				<div id="FM_EntityLoad" class="loader"></div>
				<ul class="entities-list">
				</ul>
			</div>
		</div>

		<script type="text/template" id="tpl-entity-item">
			<li class="entity-entry">
				<div class="ml-05 items-horizontal">
					<i class="fa 
						<%? it.type == 'dir' %>
							fa-folder
						<%??%>
							fa-file-o
						<%?%> folder-icon">
					</i>
					<span class="fill-free-4"><%= it.name %></span>
					<span class="fill-free text-right">
						<%? it.type == 'dir' %>
							---
						<%??%>
							<%= this.humanReadableSize( it.size ) %>
						<%?%>
					</span>
					<span class="fill-free-2 text-right"><%? it.mime == '' %>---<%?%><%? it.mime != '' %><%= it.mime %><%?%></span>
					<span class="mr-05 fill-free-2 text-right"><%= it.modifyDate %></span>
				</div>
			</li>
		</script>
		<script type="text/template" id="tpl-directory-item">
			<li class="dir-entry">
				<div>
					<p data-click="browse" class="items-horizontal">
						<i class="fa fa-angle-right caret 
							<%? !it.children.length %>
								invisible
							<%?%>" data-click="toggle">
						</i>
						<i class="fa fa-folder folder-icon"></i>
						<span><%= it.name %></span>
					</p>
				</div>
				<ul class="directory-subtree hidden"></ul>
			</li>
		</script>

	</section>
</div>
