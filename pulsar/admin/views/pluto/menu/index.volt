<div id="content" class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5">Menu</h2>
		<p class="description">
			Lista wszystkich utworzonych menu które można przypisać do
			odpowiednio skonfigurowanej sekcji na stronie.
		</p>
	</div>

    {{ tag.tabControl([
        'index'   : 'name',
        'source'  : switch,
        'class'   : 'white-back head-bar',
        'data'    : [
            'searcher': '#menu-index-container'
        ]
    ]) }}

	<section id="menu-index-container" class="container">
		<!-- wyświetl dwie tablice z czego jedną ukryj -->
	    {% for index, single in data %}

	    	<!-- gdy nie ma danych, wyświetl komunikat -->
	    	{% if single|length == 0 %}
	    		<p data-variant="{{switch[index].getId()}}"
	    			class="message info {{ index == 0 ? '' : 'hidden' }}">
	    			Brak elementów do wyświetlenia.
    			</p>

	    	<!-- w przeciwnym wypadku wyświetl je w tablicy -->
	    	{% else %}
				<table class="w100p zebra {{ index == 0 ? '' : 'hidden' }}"
					data-variant="{{switch[index].getId()}}">

					<tr>
						<th class="identity">#</th>
						<th>Nazwa</th>
						<th>Prywatne</th>
						<th>Dostępne</th>
						<th class="text-right"></th>
					</tr>

					{% for idx, out in single %}
						<tr>
							<!-- indeks wyświetlanego elementu -->
							<td>{{idx + 1}}</td>
							<td>
								<a href="/admin/menu/edit/{{out.getId()}}">
									{{out.name}}
								</a>
							</td>
							<!-- czy menu jest prywatne? -->
							<td>{{out.private ? 'Tak' : 'Nie'}}</td>
							<!-- czy menu jest dostępne? -->
							<td>{{out.online  ? 'Tak' : 'Nie'}}</td>
							<td class="text-right w1p">
								<div class="f0">
									<a href="#" class="fa fa-clone clone"></a>
									<a href="/admin/menu/edit/{{out.getId()}}"
										class="fa fa-pencil edit"></a>
									<a href="#" class="fa fa-trash delete"></a>
								</div>
							</td>
						</tr>
					{% endfor %}
				</table>
	    	{% endif %}
	    {% endfor %}
	</section>
</div>
