import { getManager, Not } from 'typeorm'
import { Country } from '../entities/country'
import { Province } from '../entities/province'
import { City } from '../entities/city'
import { County } from '../entities/county'
import * as place from '../../taobaoPlaceEnd'

export async function up() {
  await getManager().transaction(async manager => {
    let countries: Country[] = []
    let countriesObj: any = {}
    let provinces: Province[] = []
    let provincesObj: any = {}
    let cities: City[] = []
    let citiesObj: any = {}
    let counties: County[] = []
    for (let i of place.countries) {
      let country = new Country()
      country.number = i.number
      country.name = i.name
      country.nameE = i.Ename
      countries.push(country)
      countriesObj[i.number] = country
    }
    for (let i of place.provinces) {
      let province = new Province()
      province.number = i.number
      province.name = i.name
      province.country = countriesObj[i.country]
      provinces.push(province)
      provincesObj[i.number] = province

      let city = new City()
      city.number = i.number + 'b'
      city.name = '空'
      city.province = province
      cities.push(city)
      citiesObj[city.number] = city
    }
    for (let i of place.cities) {
      let city = new City()
      city.number = i.number
      city.name = i.name
      city.province = provincesObj[i.province]
      cities.push(city)
      citiesObj[i.number] = city

      let county = new County()
      county.number = i.number + 'c'
      county.name = '空'
      county.city = city
      counties.push(county)
    }
    for (let i of place.counties) {
      let county = new County()
      county.number = i.number
      county.name = i.name
      county.city = citiesObj[i.city]
      counties.push(county)
    }

    let province = new Province()
    province.number = 'a'
    province.name = '空'
    province.country = countriesObj['1']
    provinces.push(province)

    let city = new City()
    city.number = 'ab'
    city.name = '空'
    city.province = province
    cities.push(city)

    let county = new County()
    county.number = 'abc'
    county.name = '空'
    county.city = city
    counties.push(county)

    await manager.save(countries)
    await manager.save(provinces)
    await manager.save(cities)
    while (counties.length > 0)  await manager.save(counties.splice(0, 1000))
  })
}

export async function down() {
  await getManager().transaction(async manager => {
    await manager.delete(County, {id: Not(0)})
    await manager.delete(City, {id: Not(0)})
    await manager.delete(Province, {id: Not(0)})
    await manager.delete(Country, {id: Not(0)})
  })
}
