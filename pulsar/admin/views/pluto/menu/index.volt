<div id="content" class="items-vertical fill-free">
	<div class="head-bar mb00">
		<h2 class="mb5">Menu</h2>
		<p class="description">
			Lista wszystkich utworzonych menu które można przypisać do
			odpowiednio skonfigurowanej sekcji na stronie.
		</p>
	</div>

	{{ tag.checkBox([
		'checked': false,
		'label': 'Elementy bez tłumaczenia',
		'class': 'head-bar white-back'
	]) }}

	<section class="container">

		<table class="w100p zebra">
			<tr>
				<th class="identity">#</th>
				<th>Nazwa</th>
				<th>Prywatne</th>
				<th>Dostępne</th>
				<th class="text-right"></th>
			</tr>
			{% for single in data %}
				<tr>
					<td>{{single.order}}</td>
					<td>
						<a href="/admin/menu/edit/{{bin2guid(single.id)}}">
							{{single.name}}
						</a>
					</td>
					<!-- czy menu jest prywatne? -->
					<td>{{single.private ? 'Tak' : 'Nie'}}</td>
					<!-- czy menu jest dostępne? -->
					<td>{{single.online  ? 'Tak' : 'Nie'}}</td>
					<td class="text-right w1p">
						<div class="f0">
							<span class="fa fa-clone clone"></span>
							<span class="fa fa-pencil edit"></span>
							<span class="fa fa-trash delete"></span>
						</div>
					</td>
				</tr>
			{% endfor %}
		</table>
	</section>
</div>
