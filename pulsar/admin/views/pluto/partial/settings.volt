<div class="menu-slider"></div>
<aside id="optionsbar" class="items-vertical" style="width:300px;">
	<div class="breadcrumb no-padding items-horizontal">
		<span class="fill-free"><i class="fa fa-arrow-circle-o-right"></i></span>
		<span class="text-right fill-free"><i class="fa fa-send"></i></span>
	</div>
	<div class="items-vertical container fill-free">
		<div class="items-vertical">
			<header>
				<h5><i class="fa fa-caret-down"></i> Wyświetlane kolumny</h5>
			</header>
			<section>
				{{ tag.form([ 'admin/menu', 'id': 'display-columns', 'source': showColumn ]) }}
					{{ tag.checkField([ 'order',  'label': 'Zmiana kolejności elementów' ]) }}
					{{ tag.checkField([ 'id',     'label': 'Identyfikator' ]) }}
					{{ tag.checkField([ 'name',   'label': 'Nazwa' ]) }}
					{{ tag.checkField([ 'online', 'label': 'Dostępność' ]) }}

					<h6 class="bold">Dostępne akcje</h6>
					<ul>
						{{ tag.checkField([ 'action-clone',  'tag': 'li', 'label': 'Klonowanie' ]) }}
						{{ tag.checkField([ 'action-edit',   'tag': 'li', 'label': 'Edycja' ]) }}
						{{ tag.checkField([ 'action-remove', 'tag': 'li', 'label': 'Usuwanie' ]) }}
					</ul>
				{{ tag.endForm() }}
			</section>
		</div>
		<div class="items-vertical">
			<header>
				<h5><i class="fa fa-caret-down"></i> Dostęp do strony</h5>
			</header>
			<section>
				{{ tag.form([ 'admin/menu', 'id': 'page-access', 'source': pageAccess ]) }}
					{{ tag.checkField([ 'admin',     'label': 'Administrator' ]) }}
					{{ tag.checkField([ 'moderator', 'label': 'Moderator' ]) }}
					{{ tag.checkField([ 'editor',    'label': 'Recenzent' ]) }}
					{{ tag.checkField([ 'user',      'label': 'Użytkownik' ]) }}
				{{ tag.endForm() }}
			</section>
		</div>
	</div>
</aside>
