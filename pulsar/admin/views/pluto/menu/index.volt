<div class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5 mt5">Lista menu</h2>
	</div>

	<!-- przełącznik przetłumaczone / nieprzetłumaczone -->
	{{ tag.tabControl([
		'source': switch,
		'class' : 'white-back head-bar',
		'data'  : [
			'search': '#P02_Container'
		]
	]) }}

	<section id="P02_Container" class="container">

	{% if data[0]|length == 0 %}

		<p data-variant="{{switch[0].getId()}}" class="message info hidden">
			Brak elementów do wyświetlenia.
		</p>

	{% else %}

		<table class="w100p zebra hidden" data-variant="{{switch[0].getId()}}">
			<tr>
				<th class="identity">#</th>
				<th>Nazwa</th>
				<th>Prywatne</th>
				<th>Dostępne</th>
				<th class="text-right"></th>
			</tr>

		{% for out in data[0] %}

			<tr>
				<!-- indeks wyświetlanego elementu -->
				<td>{{loop.index}}</td>
				<td>
					<a href="/admin/menu/edit/{{out.getId()}}">
						{{out.name}}
					</a>
				</td>
				<td>{{out.private ? 'Tak' : 'Nie'}}</td>
				<td>{{out.online  ? 'Tak' : 'Nie'}}</td>
				<td class="text-right w1p">
					<div class="f0 action-container">
						<!-- edycja -->
						<a href="/admin/menu/edit/{{out.getId()}}"
							class="fa fa-pencil edit"></a>
						<!-- usuwanie -->
						<a href="/admin/menu/remove/{{out.getId()}}"
							class="fa fa-trash delete show-confirm"
							data-confirm="Czy na pewno chcesz usunąć to menu?">
						</a>
					</div>
				</td>
			</tr>

		{% endfor %}

		</table>

	{% endif %}
	{% if data[1]|length == 0 %}

		<p data-variant="{{switch[1].getId()}}" class="message info hidden">
			Brak elementów do przetłumaczenia.
		</p>

	{% else %}

		<table class="w100p zebra hidden"
			data-variant="{{switch[1].getId()}}">

			<tr>
				<th class="identity">#</th>
				<th>Nazwa</th>
				<th>Istniejące wersje językowe</th>
				<th class="text-right"></th>
			</tr>

		{% for out in data[1] %}

			<tr>
				<!-- indeks wyświetlanego elementu -->
				<td>{{loop.index}}</td>
				<td>
					<a href="/admin/menu/edit/{{out[0].getId()}}">
						{{out[0].name}}
					</a>
				</td>
				<!-- lista języków na które rekord został przetłumaczony -->
				<td>
				{% for single in out %}

					{{languages[single.id_language].default_name}}
					{{loop.last ? '' : '/'}}

				{% endfor %}
				</td>

				<td class="text-right w1p">
					<div class="f0">
						<!-- edycja -->
						<a href="/admin/menu/edit/{{out[0].getId()}}"
							class="fa fa-pencil edit"></a>
						<!-- usuwanie -->
						<a href="#" class="fa fa-trash delete"></a>
					</div>
				</td>
			</tr>

		{% endfor %}

		</table>

	{% endif %}

	</section>
</div>
