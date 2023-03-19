'use client';

import React, { useState, useEffect } from 'react';
import Post from './Post';
import usePosts from '../(hooks)/usePosts';
import pb from '../(lib)/pocketbase';
import { Input, Text, Spacer, useTheme, Link } from '@nextui-org/react';
import { Search } from 'react-iconly';
import styles from '@/app/(components)/Post.module.css';

export default function Posts(props) {
  const { getPosts, getPostsByUser } = usePosts();
  const { theme } = useTheme();

  const [data, setData] = useState([]);
  const [title, setTitle] = useState('Most recent');
  const [category, setCategory] = useState('');

  useEffect(() => {
    props.user
      ? getPostsByUser(props.user).then((posts) => {
          setData(posts);
        })
      : getPosts().then((posts) => {
          setData(posts);
        });
  }, []);

  async function handleSearch(string) {
    try {
      const filter = `title ~ "${string}"`;
      const results = await pb.collection('advertisements').getFullList(200, {
        filter: filter,
        expand: 'seller',
        sort: '-created',
      });
      setData(results);
    } catch (error) {
      console.error(error);
    }
    if (string) {
      setTitle('Search results:');
    } else {
      setTitle('Most recent');
    }
  }

  async function handleCategoryClick(cat) {
    try {
      let filter = '';
      if (cat !== 'all categories') {
        filter = `category = "${cat}"`;
      }
      const results = await pb.collection('advertisements').getFullList(200, {
        filter: filter,
        expand: 'seller',
        sort: '-created',
      });
      setData(results);
      setCategory(cat);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {props.withSearch && (
          <>
            <Spacer y={0.7} />
            <Input
              bordered
              clearable
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)}
              css={{ width: '100%', backgroundColor: '$backgroundContrast' }}
              contentRight={
                <Search
                  set="curved"
                  primaryColor={theme.colors.gray700.value}
                  style={{ fontSize: '18' }}
                />
              }
            />
            <Spacer y={0.5} />

            <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
              <Link style={{ fontWeight: 'bold', marginRight: '200px' }}></Link>
              <Link
                onClick={() => handleCategoryClick('all categories')}
                style={{
                  color:
                    category === 'all categories'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                All categories
              </Link>
              <Link
                onClick={() => handleCategoryClick('Electronics')}
                style={{
                  color:
                    category === 'Electronics'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                Electronics
              </Link>
              <Link
                onClick={() => handleCategoryClick('Tool kit')}
                style={{
                  color:
                    category === 'Tool kit'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                Tool kit
              </Link>
              <Link
                onClick={() => handleCategoryClick('Car')}
                style={{
                  color:
                    category === 'Car'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                Car
              </Link>
              <Link
                onClick={() => handleCategoryClick('Power tools')}
                style={{
                  color:
                    category === 'Power tools'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                Power tools
              </Link>
              <Link
                onClick={() => handleCategoryClick('Hobby')}
                style={{
                  color:
                    category === 'Hobby'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                Hobby
              </Link>
              <Link
                onClick={() => handleCategoryClick('Other')}
                style={{
                  color:
                    category === 'Other'
                      ? theme.colors.text.value
                      : theme.colors.green600.value,
                  cursor: 'pointer',
                }}
              >
                Other
              </Link>
            </div>
          </>
        )}
        <Text h2>{title}</Text>
        <div className={styles.postContainer}>
          {data?.map((item) => (
            <Post
              key={item.id}
              title={item.title}
              id={item.id}
              created={item.created}
              price={item.price}
              sellerName={item.expand.seller.name}
              telephone_number={item.expand.seller.telephone_number}
              description={item.description}
              image={item.pictures[0]}
              category={item.category}
            />
          ))}
        </div>
        <Spacer y={1} />
      </div>
    </>
  );
}