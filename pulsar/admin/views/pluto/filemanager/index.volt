{{ javascript_include("vendors/js/doT.min") }}
{{ javascript_include("vendors/js/qwest.min") }}

<div class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5 mt5">Menedżer plików</h2>
	</div>
	<!-- menedżer plików -->
	<section class="filemanager white-back fill-free items-horizontal">

		<!-- panel z drzewem folderów -->
		<aside id="FM_E-Sidebar" class="sidebar lightgrey-back items-vertical">
			<div class="breadcrumb items-horizontal">
				<!-- przycisk przejścia do głównego katalogu -->
				<i id="FM_B-Home" class="fa fa-home"></i>
				<span class="fill-free"></span>
				<!-- przycisk odświeżania -->
				<i id="FM_B-Refresh" class="fa fa-refresh"></i>
			</div>
			<!-- drzewo katalogów -->
			<div class="directory-panel fill-free p05">
				<div id="FM_E-Directory" class="loader"></div>
				<ul class="directory-tree">
				</ul>
			</div>
		</aside>

		<!-- panel z listą elementów w katalogu -->
		<div class="fill-free items-vertical">
			<div class="breadcrumb items-horizontal">
				<!-- przełączanie paska z drzewem katalogów -->
				<i id="FM_B-ToggleTree" class="fa fa-arrow-circle-o-left"></i>
				<!-- przejście do góry w drzewie katalogów -->
				<i id="FM_B-Up" class="fa fa-level-up"></i>
				<p class="title root fill-free">Pulsar</p>
				<!-- dodawanie nowego pliku -->
				<i id="FM_B-Upload" class="fa fa-upload"></i>
				<!-- tworzenie nowego folderu -->
				<i id="FM_B-NewFolder" class="fa fa-folder"></i>
				<!-- zamykanie okna ze szczegółami pliku -->
				<i id="FM_B-CloseInfo" class="fa fa-times hidden"></i>
			</div>
			<!-- lista elementów -->
			<div class="entity-panel fill-free p05">
				<div id="FM_E-Entity" class="loader"></div>
				<ul class="entities-list">
				</ul>
				<div id="FM_E-Details" class="items-vertical">
				</div>
			</div>
			<!-- pasek sterowania katalogami -->
			<div id="FM_E-Footer" class="breadcrumb bottom items-horizontal">
				<p id="FM_B-Download" class="button simple disabled">
					<i class="fa fa-download"></i>Pobierz
				</p>
				<span class="fill-free"></span>
				<p id="FM_B-Rename" class="button simple disabled">
					<i class="fa fa-pencil"></i>Zmień nazwę
				</p>
				<p id="FM_B-Remove" class="button simple disabled">
					<i class="fa fa-trash"></i>Usuń
				</p>
			</div>
		</div>

		<!-- szablon dla pojedynczego elementu w liście plików -->
		<script type="text/template" id="FM_T-EntityItem">
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
					<span class="fill-free-2 text-right">
						<%? it.mime == '' %>
							---
						<%??%>
							<%= it.mime %>
						<%?%>
					</span>
					<span class="mr-05 fill-free-2 text-right">
						<%= this.formatDate( it.modify ) %>
					</span>
				</div>
			</li>
		</script>

		<!-- szablon dla elementu w drzewie katalogów -->
		<script type="text/template" id="FM_T-DirectoryItem">
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
