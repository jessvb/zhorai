import scrapy
import itertools
import re
import string

def clean_html(raw_html):
	clean_amp = re.compile('&amp;?')
	clean_text = [re.sub(clean_amp, '', val) for val in raw_html]
	cleanr = re.compile('<.*?>')
	clean_text = [re.sub(cleanr, '', val) for val in clean_text]
	clean_text = [re.sub(r'^https?:\/\/.*[\r\n]*', '', val, flags=re.MULTILINE) for val in clean_text]
	clean_punct = re.compile('[^\w\s.-]')
	clean_text = [re.sub(clean_punct, '', val) for val in clean_text]
	clean_text = [re.sub('\n+', '', val) for val in clean_text]
	return clean_text

class EcosystemsSpider(scrapy.Spider):
	name = "ecosystem_spider"
	prefixes = ["forest", "desert", "rainforest", "grassland", "tundra", "plain"]
	base_urls = ["https://www.google.com/search?q={0}%20ecosystem",
			 "https://www.google.com/search?q={0}%20ecosystem%20characteristics",
			 "https://www.google.com/search?q={0}%20biome",
			 "https://www.google.com/search?q={0}%20biome%20characteristics",
			 "https://www.google.com/search?q={0}%20animals",
			 "https://www.google.com/search?q={0}%20animal%20characteristics",
			 "https://www.google.com/search?q={0}%20plants%20and%20animals",
			 "https://www.google.com/search?q={0}%20facts",
			 "https://www.google.com/search?q={0}%20weather",
			 "https://www.google.com/search?q={0}%20temperature",
			 "https://www.google.com/search?q=understanding%20{0}%20ecosystems",
			]
	prefixes_and_bases = list(itertools.product(prefixes, base_urls))
	start_urls = [b.format(p) for (p, b) in prefixes_and_bases]
	start_urls = start_urls + [s + "%20for%20kids" for s in start_urls]
	custom_settings = {
		'DEPTH_LIMIT': 5,
		'CONCURRENT_REQUESTS': 100,
		'USER_AGENT': 'Googlebot',
	}
	def parse(self, response):
		DESCRIPTION_SELECTOR = '//span[@class="st"]'
		CONTENT_SELECTOR = '//div/p[1]/text()'
		yield {
			'description': clean_html(response.xpath(DESCRIPTION_SELECTOR).extract()),
			'content': clean_html(response.xpath(CONTENT_SELECTOR).extract())
		}	
		NEXT_PAGE_SELECTOR = '.fl a ::attr(href)'
		next_page = response.css(NEXT_PAGE_SELECTOR).extract();
		NEXT_PAGE_SELECTOR = '.r a ::attr(href)'
		next_page = next_page + response.css(NEXT_PAGE_SELECTOR).extract();
		for page in next_page:
			yield scrapy.Request(
				response.urljoin(page),
				callback=self.parse
			)