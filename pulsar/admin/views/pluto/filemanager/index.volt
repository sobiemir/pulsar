{{ javascript_include("vendors/js/doT.min") }}
{{ javascript_include("vendors/js/qwest.min") }}

<div class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5 mt5">Menedżer plików</h2>
	</div>
	<!-- menedżer plików -->
	<section id="filemanager" class="white-back fill-free items-horizontal">

		<!-- panel z drzewem folderów -->
		<aside data-panel="sidebar" class="lightgrey-back items-vertical">
			<div class="breadcrumb items-horizontal">
				<!-- przycisk przejścia do głównego katalogu -->
				<i data-button="home" class="fa fa-home"></i>
				<span class="fill-free"></span>
				<!-- przycisk odświeżania -->
				<i data-button="refresh" class="fa fa-refresh"></i>
			</div>

			<!-- drzewo katalogów -->
			<div class="directory-panel fill-free p05">
				<div data-panel="directoryLoader" class="loader"></div>
				<ul data-panel="directories" class="directory-tree">
				</ul>
			</div>
		</aside>

		<!-- panel z listą elementów w katalogu -->
		<div class="fill-free items-vertical">
			<div class="breadcrumb items-horizontal">
				<!-- przełączanie paska z drzewem katalogów -->
				<i data-button="toggleTree"
					class="fa fa-arrow-circle-o-left"></i>
				<!-- przejście do góry w drzewie katalogów -->
				<i data-button="up" class="fa fa-level-up"></i>

				<!-- tytuł -->
				<p data-control="title" class="title root fill-free">
					Pulsar
				</p>
				
				<!-- dodawanie nowego pliku -->
				<i data-button="showUploadPanel" class="fa fa-upload"></i>
				<!-- tworzenie nowego folderu -->
				<i data-button="showCreatePanel" class="fa fa-folder"></i>
				<!-- pobieranie aktualnie otwartego pliku -->
				<a data-button="downloadCurrent" href="#"
					class="fa fa-download hidden"></a>

				<!-- otwieranie poprzedniego pliku na liście -->
				<i data-button="prevFile"
					class="fa fa-chevron-left hidden"></i>
				<!-- otwieranie następnego pliku na liście -->
				<i data-button="nextFile"
					class="fa fa-chevron-right hidden"></i>

				<!-- zamykanie okna ze szczegółami pliku -->
				<i data-button="closePreview" class="fa fa-times hidden"></i>
			</div>

			<!-- panel tworzenia katalogu -->
			<div data-panel="createDirectory"
				class="breadcrumb items-horizontal hidden">
				<i class="fa fa-folder icononly"></i>
				<input data-control="entityName" type="text"
					class="fill-free" />
				<button data-button="createDirectory" class="button simple">
					<i class="fa fa-plus"></i>Utwórz
				</button>
			</div>

			<!-- panel wgrywania pliku -->
			<form data-panel="uploadFile" action="" method="post" 
				class="breadcrumb items-horizontal hidden">
				<label for="FM_IUpload" class="button simple">
					<i class="fa fa-file"></i>Wybierz pliki
				</label>
				<input data-control="uploadFile" id="FM_IUpload"
					name="upload_files" multiple type="file" class="hidden" />
				<input data-control="selectedFiles" type="text"
					class="fill-free" value="Brak plików..." disabled>
				<button data-button="uploadFile" type="submit"
					class="button simple">
					<i class="fa fa-plus"></i>Dodaj wybrane
				</button>
			</form>
			<!-- lista elementów -->
			<div class="entity-panel fill-free p05">
				<div data-panel="entityLoader" class="loader"></div>

<!--
				<form data-panel="uploadFile" action="" method="post" 
					class="popup light items-horizontal hidden">

					<div class="container">
						<label for="FM_IUpload" class="button simple">
							<i class="fa fa-file"></i>Wybierz pliki
						</label>
						<input
							data-control="uploadFile" id="FM_IUpload" multiple
							name="upload_files" type="file" class="hidden" />
						<input
							data-control="fileList" type="text" disabled
							class="fill-free" value="Brak plików...">
						<button
							data-button="uploadFile" type="submit"
							class="button simple">
							<i class="fa fa-plus"></i>
							Dodaj wybrane
						</button>
					</div>
				</form>
-->

				<ul data-panel="entities" class="entities-list">
				</ul>
				<div data-panel="details" class="details hidden items-vertical">
					<div class="details-container">
						<textarea data-control="filePreview"></textarea>
						<img data-control="imagePreview" src="" />
					</div>
					<div class="file-info">
						<dl>
							<dt>Nazwa pliku:</dt>
							<dd data-detail="name"></dd>

							<dt>Typ:</dt>
							<dd data-detail="type"></dd>

							<dt>Zmodyfikowano:</dt>
							<dd data-detail="modified"></dd>

							<dt>Rozmiar:</dt>
							<dd data-detail="size"></dd>
						</dl>
					</div>
				</div>
			</div>
			<!-- pasek sterowania katalogami -->
			<div data-panel="footer" class="breadcrumb bottom items-horizontal">
				<a href="#" data-button="download"
					class="button simple disabled">
					<i class="fa fa-download"></i>Pobierz
				</a>
				<span class="fill-free"></span>
				<p data-button="rename" class="button hidden simple disabled">
					<i class="fa fa-pencil"></i>Zmień nazwę
				</p>
				<p data-button="remove" class="button hidden simple disabled">
					<i class="fa fa-trash"></i>Usuń
				</p>
			</div>
		</div>

		<!-- szablon dla pojedynczego elementu w liście plików -->
		<script type="text/template" data-template="entity">
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
							<%= it.size.toSizeString() %>
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
						<%= it.modify.toDateString() %>
					</span>
				</div>
			</li>
		</script>

		<!-- szablon dla elementu w drzewie katalogów -->
		<script type="text/template" data-template="directory">
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
