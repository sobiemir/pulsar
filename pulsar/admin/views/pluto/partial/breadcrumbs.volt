<!-- nawigacja na samej górze strony z przyciskami -->
<div class="breadcrumb items-horizontal">

<!-- informacja o aktualnym położeniu - nawigacja okruszkowa -->
{% if breadcrumb is defined %}

	<p class="title">

	<!-- linki nawigacji -->
	{% for bc in breadcrumb %}
		<a href="{{ bc['url'] }}">{{ bc['name'] }}</a>
		<span class="raquo">&raquo;</span>
	{% endfor %}

	</p>

{% endif %}

<!-- przyciski dla strony -->
{% if topButtons is defined %}

	<div class="button-container items-horizontal fill-free text-right">
		<span class="fill-free"></span>

		<!-- przyciski w górnej belce -->
		{% for button in topButtons %}

			<a id="{{ button['id'] }}"
				class="button simple {{ button['class'] }}"
				title="{{ button['name'] }}"
				href="{{ button['url'] }}">
			</a>

		{% endfor %}

	</div>

{% endif %}

</div>