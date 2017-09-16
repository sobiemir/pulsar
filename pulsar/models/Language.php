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
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

class Language extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var string
     * @Primary
     * @Column(type="string", length=16, nullable=false)
     */
    public $id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $frontend;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $backend;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $direction;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $order;

    /**
     *
     * @var string
     * @Column(type="string", length=20, nullable=false)
     */
    public $code;

    /**
     *
     * @var string
     * @Column(type="string", length=100, nullable=false)
     */
    public $default_name;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany(
            'id',
            '\Pulsar\Model\Menu',
            'id_language',
            ['alias' => 'menu']
        );
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'language';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Language[]
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Language
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
