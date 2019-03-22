import scrapy
import itertools

class EcosystemsSpider(scrapy.Spider):
	name = "ecosystem_spider"
	prefixes = ["types%20of", "forest", "desert", "rainforest", "grassland", "tundra"]
	base_urls = ["https://www.google.com/search?q={0}%20ecosystems",
			 "https://www.google.com/search?q={0}%20animals"]
	prefixes_and_bases = list(itertools.product(prefixes, base_urls))
	start_urls = [b.format(p) for (p, b) in prefixes_and_bases]
	print(start_urls)
	"""
	custom_settings = {
		'DEPTH_LIMIT': 1,
		'CONCURRENT_REQUESTS': 100
	}
	"""
	def parse(self, response):
		RESULT_SELECTOR = '.s'
		for brickset in response.css(RESULT_SELECTOR):
			DESCRIPTION_SELECTOR = '//span[@class="st"]'
			yield {
				'description': brickset.xpath(DESCRIPTION_SELECTOR).extract()
			}	
		"""
		NEXT_PAGE_SELECTOR = '.fl a ::attr(href)'
		next_page = response.css(NEXT_PAGE_SELECTOR).extract();
		for page in next_page:
			yield scrapy.Request(
				response.urljoin(page),
				callback=self.parse
			)
		"""
