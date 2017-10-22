<?php
namespace Pulsar\Helper;
/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *     ___       __            
 *    / _ \__ __/ /__ ___ _____
 *   / ___/ // / (_-</ _ `/ __/
 *  /_/   \_,_/_/___/\_,_/_/
 *
 *  This source file is subject to the New BSD License that is bundled
 *  with this package in the file LICENSE.txt.
 *
 *  You should have received a copy of the New BSD License along with
 *  this program. If not, see <http://www.licenses.aculo.pl/>.
 */

use Phalcon\Mvc\Model\Resultset;

class Tags extends \Phalcon\Tag
{
	private static $_index = 1;

	public static function hiddenModelFlags( array $attrs = [] ): string
	{
		$name   = 'flag';
		$elemid = $attrs['id']     ?? $name;
		$source = $attrs['source'] ?? self::$_source ?? null;
		$retval = '';
		$index  = 1;

		// brak źródeł
		if( !$source || empty($source) )
			return $retval;

		unset( $attrs['source'] );

		if( !isset($attrs['data']) )
			$attrs['data'] = [];
		$attrs['data']['mflag'] = true;

		foreach( $source as $elem )
		{
			$attrs['id']    = $elemid . '-' . $index++;
			$attrs['name']  = $name   . ':' . $elem->getVariant();
			$attrs['value'] = $elem->getFlag();
			$attrs['type']  = 'hidden';

			$attrs   = self::_attributesConverter( $attrs );
			$retval .= self::_buildTag( 'input', false, $attrs );
		}

		return $retval;
	}

	public static function textBoxLang( array $attrs = [] ): string
	{
		$name     = $attrs['name']     ?? self::getNextId();
		$class    = $attrs['class']    ?? '';
		$elemid   = $attrs['id']       ?? $name;
		$source   = $attrs['source']   ?? self::$_source   ?? null;
		$selected = $attrs['selected'] ?? self::$_selected ?? null;
		$retval   = '';
		$index    = 1;

		if( !$source || empty($source) )
			return $retval;

		unset( $attrs['selected'] );
		unset( $attrs['source'] );

		// utwórz tablicę dla dodatkowych danych gdy nie istnieje
		if( !isset($attrs['data']) )
			$attrs['data'] = [];

		// gdy nie podano, domyślnie aktywuj pierwszy element
		if( !$selected )
			self::$_selected = $selected = $source[0]->getVariant();

		// generuj pojedyncze elementy
		foreach( $source as $elem )
		{
			$variant = $elem->getVariant();

			$attrs['id']    = $elemid . '-' . $index++;
			$attrs['name']  = $name   . ':' . $variant;
			$attrs['value'] = $elem->{$name};

			// ukryj element gdy nie jest aktywny
			if( $selected != $variant )
				$attrs['class'] = $class . ' hidden';
			else
				$attrs['class'] = $class;

			$attrs['data']['variant'] = $variant;

			// utwórz pole tekstowe
			$retval .= self::textBox( $attrs );
		}

		return $retval;
	}

	public static function checkBoxLang( array $attrs = [] ): string
	{
		$name     = $attrs['name']     ?? self::getNextId();
		$class    = $attrs['class']    ?? '';
		$elemid   = $attrs['id']       ?? $name;
		$source   = $attrs['source']   ?? self::$_source   ?? null;
		$selected = $attrs['selected'] ?? self::$_selected ?? null;
		$retval   = '';
		$index    = 1;

		if( !$source || empty($source) )
			return $retval;

		unset( $attrs['selected'] );
		unset( $attrs['source'] );

		// utwórz tablicę dla dodatkowych danych gdy nie istnieje
		if( !isset($attrs['data']) )
			$attrs['data'] = [];

		// gdy nie podano, domyślnie aktywuj pierwszy element
		if( !$selected )
			self::$_selected = $selected = $source[0]->getVariant();

		// generuj pojedyncze elementy
		foreach( $source as $elem )
		{
			$variant = $elem->getVariant();

			$attrs['id']      = $elemid . '-' . $index++;
			$attrs['name']    = $name   . ':' . $variant;
			$attrs['checked'] = $elem->{$name};

			// ukryj element gdy nie jest aktywny
			if( $selected != $variant )
				$attrs['class'] = $class . ' hidden';
			else
				$attrs['class'] = $class;

			$attrs['data']['variant'] = $variant;

			// utwórz pole tekstowe
			$retval .= self::checkBox( $attrs );
		}

		return $retval;
	}

	public static function textBox( array $attrs = [] ): string
	{
		$attrs['name']  = $attrs['name']  ?? self::getNextId();
		$attrs['id']    = $attrs['id']    ?? $attrs['name'];
		$attrs['value'] = $attrs['value'] ?? '';
		$attrs['type']  = 'text';

		$attrs = self::_attributesConverter( $attrs );
		return self::_buildTag( 'input', false, $attrs );
	}

	public static function checkBox( array $attrs = [] ): string
	{
		$attrs['name']  = $attrs['name']  ?? self::getNextId();
		$attrs['id']    = $attrs['id']    ?? $attrs['name'];
		$attrs['value'] = $attrs['value'] ?? 'on';
		$attrs['type']  = 'checkbox';
		$attrs['class'] = $attrs['class'] ?? '';

		// lista atrybutów przeznaczonych dla kontrolki input
		$inputattrs = [
			'disabled' => 'disabled',
			'checked'  => 'checked',
			'autofocus'=> '',
			'form'     => '',
			'name'     => '',
			'required' => '',
			'tabindex' => '',
			'value'    => '',
			'type'     => ''
		];

		$retval = '';
		$chkdat = [];
		$attrs = self::_attributesConverter( $attrs );

		// wydziel atrybuty przeznaczone dla kontrolki "label"
		if( isset($attrs['label']) )
		{
			$label = [
				'for'   => $attrs['for'] ?? self::getNextId(),
				'value' => $attrs['label']
			];

			// wywal atrybuty z głównej tablicy
			unset( $attrs['for'] );
			unset( $attrs['label'] );

			// utwórz identyfikator kontrolki "checkbox"
			$chkdat['id'] = $label['for'];

			// zbuduj element
			$retval .= self::_buildTag( 'label', true, $label );
		}

		// wydziel atrybuty przeznaczone dla kontrolki "checkbox"
		foreach( $inputattrs as $key => $value )
			if( isset($attrs[$key]) )
			{
				if( $value != '' )
					$attrs['class'] .= ' ' . $value;

				$chkdat[$key] = $attrs[$key];
				unset( $attrs[$key] );
			}

		// zbuduj element
		$retval = self::_buildTag( 'input', false, $chkdat ) .
			"<span></span>{$retval}";

		// dopisz wartość i klasę
		$attrs['value']  = $retval;
		$attrs['class'] .= ' checkbox items-horizontal';

		// zbuduj całą kontrolkę
		return self::_buildTag( 'div', true, $attrs );
	}

	public static function tabControl( array $attrs = [] ): string
	{
		$attrs['id']    = $attrs['id']    ?? self::getNextId();
		$attrs['class'] = $attrs['class'] ?? '';

		$source   = $attrs['source']   ?? null;
		$selected = $attrs['selected'] ?? self::$_selected ?? null;
		$index    = $attrs['index']    ?? null;

		// usuń nieużywane pola z głównej tablicy
		unset( $attrs['source'] );
		unset( $attrs['selected'] );
		unset( $attrs['index'] );

		$attrs['class'] .= ' tab-control items-horizontal';

		// sprawdź czy kontrolka ma skąd wziąć dane
		if( !$source )
			if( isset(self::$_source[$attrs['id']]) )
				$source = self::$_source[$attrs['id']];

		// nie twórz gdy brak źródła danych
		if( $source == null || $index == null )
			return '';

		// aktywuj zaznaczony element lub pierwszy lepszy gdy go brak
		if( !$selected )
			$selected = self::$_selected = $source[0]->getId();
		else
			$selected = self::$_selected = $selected->getId();

		// twórz pojedyncze elementy kontrolki
		$retval = '';
		foreach( $source as $value )
		{
			$class = '';
			if( $selected && $selected == $value->getId() )
				$class .= 'selected ';
			if( $value->isDisabled() )
				$class .= 'disabled ';

			$elemattrs = [
				'data' => [
					'id' => $value->getId()
				],
				'class' => $class,
				'value' => $value->{$index}
			];
			$retval .= self::_buildTag( 'li', true, $elemattrs );
		}

		// utwórz kontrolkę zawierającą zakładki
		$attrs['value'] = $retval;
		return self::_buildTag( 'ul', true, $attrs );
	}

	/**
	 * Tworzy element rozpoczynający formularz.
	 *
	 * PARAMETERS:
	 *     $params: array
	 *         Parametry przekazywane do formularza.
	 *
	 * RETURNS: string
	 *     Utworzony element w HTML.
	 */
	public static function beginForm( array $parms ): string
	{
		self::$_source = $parms['source'] ?? null;
		unset( $parms['source'] );

		$retval = parent::form( $parms );

		// ukryta kontrolka z nazwą formularza
		$retval .= parent::hiddenField([
			'form',
			'id'    => null,
			'value' => $params['name'] ?? $parms['id']
		]);

		return $retval;
	}

	/**
	 * Tworzy element zamykający formularz.
	 * 
	 * RETURNS: string
	 *     Utworzony element w HTML.
	 */
	public static function endForm(): string
	{
		self::$_source = [];
		return parent::endForm();
	}

	/**
	 * Tworzy element SVG z logo programu.
	 *
	 * PARAMETERS:
	 *     $size: integer
	 *         Rozmiar obrazu SVG w pikselach.
	 *     $color1: string
	 *         Kolor podstawowy loga w formacie HEX.
	 *     $color2: string
	 *         Kolor dodatkowy loga w formacie HEX.
	 *
	 * RETURNS: string
	 *     Utworzony element SVG.
	 */
	public static function logo( int $size = 64, string $color1 = "#4a4a4a",
		string $color2 = "#c83737" ): string
	{
		$scale = $size / 64;
		return
			'<svg width="' . $size . '" height="' . $size . '">
				<g transform="scale(' . $scale . ')">
					<path fill="' . $color1 . '" d="m 32,-1.3e-5
						c -17.673124,-8e-12 -32.000016568553, 14.326906
						-32,32.00003 0,17.673112 14.326888,32 32,32 17.673112,0
						32,-14.326888 32,-32 C 64.000017,14.326893
						49.673124,-1.3000008e-5 32,-1.3e-5 Z m 0,6 c 14.359415,0
						26.000017,11.640615 26,26.00003 -0.117112,14.46527
						-11.837624,25.595416 -26,26 -14.359403,0 -26,-11.640597
						-26,-26 C 6.1172531,17.534909 17.837554,6.4044259
						32,5.999987 Z" />
					<path fill="' . $color1 . '" d="m32,17.999117a14,14 0 0 1
						14,14l6,0a20,20 0 0 0 -20,-20l0,6z" />
					<path fill="' . $color1 . '" d="m12,31.999117a20,20 0 0 0
						20,20l0,-6a14,14 0 0 1 -14,-14l-6,0z" />
					<circle fill="' . $color2 . '" r="8" cy="32.000017"
						cx="31.999998" />
				</g>
			</svg>';
	}

// =============================================================================

	/**
	 * Konwertuje atrybuty na odpowiadającą im wartość.
	 *
	 * DESCRIPTION:
	 *     Przydatne szczególnie dla kontrolek w których atrybuty liczbowe
	 *     mają być zamieniane na ich tekstowe odpowiedniki, oraz dla tych,
	 *     które posiadają atrybuty binarne, czyli atrybuty które są lub których
	 *     nie ma, ale przekazywane zawsze zawierają wartość TRUE lub FALSE.
	 *
	 * PARAMETERS:
	 *     $attrs: array
	 *         Lista atrybutów do konwersji.
	 *
	 * RETURNS:
	 *     Przetworzoną listę atrybutów.
	 */
	private static function _attributesConverter( array $attrs ): array
	{
		$bool = [
			'checked',
			'disabled',
			'autofocus',
			'required',
			'readonly'
		];

		foreach( $bool as $index )
			if( isset($attrs[$index]) )
			{
				if( $attrs[$index] )
					$attrs[$index] = true;
				else
					unset( $attrs[$index] );
			}

		return $attrs;
	}

	/**
	 * Tworzy element HTML z podanych wartości.
	 *
	 * DESCRIPTION:
	 *     Funkcja tworzy element z podanych do funkcji danych.
	 *     Atrybuty przekazywane do funkcji nie są konwertowane, trzeba je
	 *     wcześniej samemu przepuścić przez funkcję _attributesConverter.
	 *     Atrybuty z przedrostkiem data mogą być przechowywane w tablicy.
	 *     Utworzony element może być albo złożony albo prosty.
	 *     Elementy proste w przeciwieństwie do elementów złożonych nie
	 *     posiadają znacznika zamykającego.
	 *
	 *     Element prosty: <input type="text" value="Pulsar" />.
	 *     Element złożony: <p attr="pulsar">System zarządzania treścią.</p>.
	 *
	 * PARAMETERS:
	 *     $name: string
	 *         Nazwa tworzonego elementu.
	 *     $composite: boolean = false
	 *         Czy element jest elementem prostym czy złożonym?
	 *     $attrs: array = []
	 *         Lista atrybutów elementu.
	 *
	 * RETURNS:
	 *     Utworzony element HTML.
	 */
	private static function _buildTag( string $name, bool $composite = false,
		array  $attrs = [] ): string
	{
		$value  = '';
		$retval = '';

		// jeżeli element jest złożony, wyciągnij wartość na zewnątrz
		if( $composite )
		{
			$value = $attrs['value'] ?? '';
			unset( $attrs['value'] );
		}

		// atrybuty z "data"
		if( isset($attrs['data']) )
		{
			foreach( $attrs['data'] as $key => $data )
				$retval .= is_bool( $data )
					? " data-{$key}"
					: " data-{$key}=\"{$data}\"";

			unset( $attrs['data'] );
		}
		// pozostałe atrybuty
		foreach( $attrs as $key => $data )
			$retval .= is_bool( $data )
				? " {$key}"
				: " {$key}=\"{$data}\"";

		// element złożony - <div></div>
		if( $composite )
			return "<{$name}{$retval}>{$value}</{$name}>";

		// element prosty - <input />
		return "<{$name}{$retval} />";
	}

	/**
	 * Generuje identyfikator dla kontrolki.
	 *
	 * RETURNS: string
	 *     Wygenerowany identyfikator.
	 */
	private static function getNextId(): string
	{
		return 'pagv-' . self::$_index++;
	}








	public static function stylesheetLink( $parameters = NULL, $local = NULL )
	{
		if( $local === NULL )
			return parent::stylesheetLink( '/themes/pluto/' . $parameters . '.css', $local );

		return parent::stylesheetLink( $parameters, $local );
	}

	public static function javascriptInclude( $parameters = NULL, $local = NULL )
	{
		$url = '/themes/pluto/';

		if( !is_array($parameters) )
			$parameters = [$parameters];

		// parametr src
		if( !isset($parameters[0]) )
		{
			$parameters[0] = $parameters["src"];
			unset( $parameters['src'] );
		}

		// specjalny atrybut data-main (dla requirejs - może nie jest potrzebne?)
		if( isset($parameters['data-main']) )
			$parameters['data-main'] = $url . $parameters['data-main'];

		// ładowanie z sieci lub serwera na którym stoi strona
		if( $local === false )
			$url = $parameters[0];
		else
			$url .= $parameters[0] . '.js';

		// twórz znacznik
		$code = '<script src="' . $url . '" ';

		foreach ($parameters as $key => $attributeValue) {
			if( !is_integer($key) )
				$code .= $key . '="' . $attributeValue . '" ';
		}
		$code.= '></script>';

		return $code;
	}

	public static function image( $parameters = NULL, $local = NULL )
	{
		$url = '/themes/pluto/img/';

		if( !is_array($parameters) )
			$parameters = [$parameters];

		// parametr src
		if( !isset($parameters[0]) )
		{
			$parameters[0] = $parameters["src"];
			unset( $parameters['src'] );
		}

		// ładowanie z sieci lub serwera na którym stoi strona
		if( $local === false )
			$url = $parameters[0];
		else
			$url .= $parameters[0];

		// twórz znacznik
		$code = '<img src="' . $url . '" ';

		foreach ($parameters as $key => $attributeValue) {
			if( !is_integer($key) )
				$code .= $key . '="' . $attributeValue . '" ';
		}
		$code.= ' />';

		return $code;
	}

	public static function directUrl()
	{
		return '';
	}

	/**
	 * Przestrzeń nazw dla kontrolek z której generowane jest ID.
	 * @var string
	 */
	private static $_namespace = '';
	/**
	 * Źródło danych z którego pobierane są wartości kontrolek formularza.
	 * @var array
	 */
	private static $_source = null;

	private static $_selected = null;
}
