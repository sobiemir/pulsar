<?php
namespace Pulsar\Model;
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

use Pulsar\Helper\Utils;

class Menu extends \Phalcon\Mvc\Model
{
    /**
     *
     * @var string
     * @Primary
     * @Column(type="string", length=16, nullable=false)
     */
    public $id = null;

    /**
     *
     * @var string
     * @Primary
     * @Column(type="string", length=16, nullable=false)
     */
    public $id_language = null;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $private = false;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $online = false;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $order = 0;

    /**
     *
     * @var string
     * @Column(type="string", length=255, nullable=false)
     */
    public $name = '';

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->belongsTo(
            'id_language',
            '\Pulsar\Model\Language',
            'id'
        );
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'menu';
    }

    private $_id = null;
    private $_id_language = null;

    public function getRawId(): string
    {
        return $this->id;
    }

    public function getRawVariant(): string
    {
        return $this->id_language;
    }

    public function getId(): string
    {
        if( !$this->_id )
            $this->_id = Utils::BinToGUID( $this->id );
        return $this->_id;
    }

    public function getVariant(): string
    {
        if( !$this->_id_language )
            $this->_id_language = Utils::BinToGUID( $this->id_language );
        return $this->_id_language;
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Menu[]
     */
    public static function find( $parameters = null )
    {
        return parent::find( $parameters );
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Menu
     */
    public static function findFirst( $parameters = null )
    {
        return parent::findFirst( $parameters );
    }
}
