
<div class="box-center items-vertical">
	<!-- logo aplikacji -->
	<div id="login-logo">
		{{ tag.logo(96) }}
	</div>

	<!-- panel logowania -->
	{{ form('admin/session/login') }}
	<div id="login-panel">
		{{ flashSession.output() }}

		<!-- nazwa użytkownika -->
		<div class="input-row mb7">
			{{ text_field('username', 'placeholder': 'Nazwa użytkownika', 'class': 'fa-icon w100p') }}
			<label for="username" class="fa fa-user inside-input"></label>
		</div>

		<!-- hasło -->
		<div class="input-row mb7">
			{{ password_field('password', 'placeholder': 'Hasło', 'class': 'fa-icon w100p') }}
			<label for="password" class="fa fa-key inside-input"></label>
		</div>
		
		<!-- przycisk logowania -->
		<div class="input-row">
			{{ submit_button('form-submit', 'class': 'w100p', 'value': 'Zaloguj się') }}
		</div>
	</div>
	{{ endForm() }}
</div>
